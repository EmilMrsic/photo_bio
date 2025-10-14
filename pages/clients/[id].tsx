import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { clientAPI, pbmProtocolAPI, Client, ClientDocument } from '../../lib/xano';
import ProtocolModal from '../../components/ProtocolModal';
import ConditionSelectorModal from '../../components/ConditionSelectorModal';
import BrainMapUploadWizard from '../../components/BrainMapUploadWizard';

const XANO_BASE_URL = process.env.NEXT_PUBLIC_XANO_API_URL || '';

export default function ClientDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [extractingProtocol, setExtractingProtocol] = useState<number | null>(null);
  const [extractedProtocols, setExtractedProtocols] = useState<{ [key: number]: number }>({});
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [modalProtocolNumber, setModalProtocolNumber] = useState(0);
  const [modalProtocolPhases, setModalProtocolPhases] = useState<any[]>([]);
  const [modalProtocolLabel, setModalProtocolLabel] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [showConditionSelector, setShowConditionSelector] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState<{ documentId: number; fileUrl: string } | null>(null);
  const [showBrainMapWizard, setShowBrainMapWizard] = useState(false);
  const [allProtocols, setAllProtocols] = useState<any[]>([]);
  const [showDeleteClientModal, setShowDeleteClientModal] = useState(false);
  const [showDeleteProtocolModal, setShowDeleteProtocolModal] = useState(false);
  const [protocolToDelete, setProtocolToDelete] = useState<number | null>(null);

  // Helper function to extract client ID from slug
  const getClientIdFromSlug = (slug: string): string => {
    // Check if it's already a numeric ID
    if (/^\d+$/.test(slug)) {
      return slug;
    }
    // Extract ID from fname-lname-id format (e.g., "john-doe-13" -> "13")
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    if (/^\d+$/.test(lastPart)) {
      return lastPart;
    }
    return slug; // Fallback to original
  };

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Extract numeric ID from slug
        const clientId = getClientIdFromSlug(id as string);

        // Fetch client details
        const clientData = await clientAPI.getClient(clientId);
        console.log('Client data:', clientData);
        setClient(clientData);

        // Update URL to use proper slug format if currently using numeric ID
        if (clientData && id !== `${clientData.first_name}-${clientData.last_name}-${clientData.id}`.toLowerCase().replace(/\s+/g, '-')) {
          const slug = `${clientData.first_name}-${clientData.last_name}-${clientData.id}`.toLowerCase().replace(/\s+/g, '-');
          router.replace(`/clients/${slug}`, undefined, { shallow: true });
        }
        
        // Fetch client documents using client ID
        if (clientData?.id) {
          try {
            console.log('Fetching documents for client ID:', clientData.id);
            const docs = await clientAPI.getClientDocuments(clientData.id);
            console.log('Documents received:', docs);
            setDocuments(docs);

            // Fetch all protocols for this client
            try {
              const protocols = await pbmProtocolAPI.getAllProtocolsByClientId(clientData.id);
              setAllProtocols(protocols);
            } catch (protocolErr) {
              console.error('Error fetching protocols:', protocolErr);
              setAllProtocols([]);
            }
          } catch (docErr) {
            console.error('Error fetching documents:', docErr);
            // Don't fail the whole page if documents fail to load
            setDocuments([]);
          }
        } else {
          console.log('No client ID found, skipping document fetch');
          setDocuments([]);
        }
      } catch (err) {
        console.error('Error fetching client:', err);
        setError('Failed to load client details.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const getFullName = () => {
    if (!client) return '';
    return `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'No name provided';
  };

  const getClientSlug = (client: Client) => {
    return `${client.first_name}-${client.last_name}-${client.id}`.toLowerCase().replace(/\s+/g, '-');
  };

  const getFullPdfUrl = (url: string) => {
    if (!url) return '';
    
    // Log the original URL for debugging
    console.log('Original file_url:', url);
    
    // If URL already starts with http, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // For Xano vault URLs, they should be accessed directly without the API prefix
    // Vault URLs are static file URLs, not API endpoints
    if (url.includes('/vault/')) {
      // Extract just the base domain from XANO_BASE_URL
      const baseUrl = XANO_BASE_URL.replace('/api:CFT-MENJ', '');
      const finalUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      console.log('Vault URL generated:', finalUrl);
      return finalUrl;
    }
    
    // For other URLs, prepend the full API base URL
    const finalUrl = `${XANO_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    console.log('API URL generated:', finalUrl);
    return finalUrl;
  };

  const handleWizardSubmit = async (file: File, condition: string) => {
    if (!client) return;

    setShowBrainMapWizard(false);
    setUploadingPdf(true);

    try {
      // Upload the PDF using the MAPS_PDF endpoint
      const uploadResult = await clientAPI.uploadMapsPDF(
        file,
        client.email,
        client.first_name,
        client.last_name
      );

      // Refresh the documents list
      if (client.id) {
        const docs = await clientAPI.getClientDocuments(client.id);
        setDocuments(docs);

        // Automatically analyze the newly uploaded document
        if (docs.length > 0) {
          const latestDoc = docs[docs.length - 1];
          await handleConditionSelected(condition, latestDoc.id, latestDoc.file_url);
        }
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload protocol document. Please try again.');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleGenerateProtocol = async (documentId: number, fileUrl: string) => {
    // Show condition selector first
    setPendingAnalysis({ documentId, fileUrl });
    setShowConditionSelector(true);
  };

  const handleViewProtocol = (protocol: any) => {
    // Convert PBMProtocol to phases format
    const phases = [
      {
        phase: 'Initial',
        window: 'Weeks 1-4',
        cadence: '3x per week',
        duration_min: protocol.stage_1_time,
        frequency_hz: protocol.hz,
        intensity_percent: protocol.stage_1_intensity,
      },
      {
        phase: 'Intermediate',
        window: 'Weeks 5-8',
        cadence: '3x per week',
        duration_min: protocol.stage_2_time,
        frequency_hz: protocol.hz,
        intensity_percent: protocol.stage_2_intensity,
      },
      {
        phase: 'Advanced',
        window: 'Weeks 9-12',
        cadence: '2x per week',
        duration_min: protocol.stage_3_time,
        frequency_hz: protocol.hz,
        intensity_percent: protocol.stage_3_intensity,
      },
    ];

    setModalProtocolNumber(0);
    setModalProtocolPhases(phases);
    setModalProtocolLabel(protocol.label);
    setShowProtocolModal(true);
  };

  const handleDeleteClient = async () => {
    if (!client?.id) return;

    try {
      await clientAPI.deleteClient(client.id.toString());
      setShowDeleteClientModal(false);
      // Redirect to clients list
      router.push('/clients');
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Failed to delete client. Please try again.');
    }
  };

  const handleDeleteProtocol = async () => {
    if (!protocolToDelete) return;

    try {
      await pbmProtocolAPI.deleteProtocol(protocolToDelete);
      // Refresh protocols list
      if (client?.id) {
        const protocols = await pbmProtocolAPI.getAllProtocolsByClientId(client.id);
        setAllProtocols(protocols);
      }
      setShowDeleteProtocolModal(false);
      setProtocolToDelete(null);
    } catch (err) {
      console.error('Error deleting protocol:', err);
      setError('Failed to delete protocol. Please try again.');
    }
  };

  const handleConditionSelected = async (condition: string, docId?: number, docUrl?: string) => {
    console.log('═══════════════════════════════════════════════');
    console.log('🎯 USER SELECTED CONDITION:', condition);
    console.log('   Client:', client?.first_name, client?.last_name);
    console.log('═══════════════════════════════════════════════');

    setShowConditionSelector(false);

    // Use provided docId/docUrl or get from pendingAnalysis
    const documentId = docId || pendingAnalysis?.documentId;
    const fileUrl = docUrl || pendingAnalysis?.fileUrl;

    if (!documentId || !fileUrl) return;

    setPendingAnalysis(null);

    setExtractingProtocol(documentId);

    // Show processing animation for ~10 seconds
    setShowProcessing(true);
    const messages = [
      `Analyzing ${client?.first_name}'s BrainMap…`,
      `Defining the right protocol…`
    ];
    let messageIndex = 0;
    setProcessingText(messages[0]);

    const textInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setProcessingText(messages[messageIndex]);
    }, 5000); // Switch message every 5 seconds for ~10 second total

    // Track start time to ensure minimum 10 second display
    const startTime = Date.now();

    try {
      // Download the PDF from the URL
      const pdfUrl = getFullPdfUrl(fileUrl);
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Failed to fetch PDF');
      
      const blob = await response.blob();
      const file = new File([blob], 'document.pdf', { type: 'application/pdf' });
      
      // Send to our API endpoint
      const formData = new FormData();
      formData.append('file', file);
      formData.append('condition', condition); // Pass the user-selected condition

      console.log('🚀 Sending to API with condition:', condition);

      const extractResponse = await fetch('/api/extract-protocol', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
        },
        body: formData,
      });
      
      const result = await extractResponse.json();

      if (!result.ok) {
        throw new Error(result.message || 'Failed to extract protocol');
      }

      console.log('Extracted protocol result:', result);
      const protocol = result.protocol_id;
      const phases = result.phases || [];

      console.log('═══════════════════════════════════════════════');
      console.log('📦 FINAL PROTOCOL ASSIGNMENT:');
      console.log('   Selected Condition:', condition);
      console.log('   Returned Protocol ID:', protocol);
      console.log('   Number of Phases:', phases.length);
      console.log('   Expected: Check protocol_router.json');
      console.log('═══════════════════════════════════════════════');

      // Store the extracted protocol
      setExtractedProtocols(prev => ({ ...prev, [documentId]: protocol }));

      // Update the client's nfb_protocol in Xano
      if (client?.id) {
        await clientAPI.updateClient(client.id.toString(), {
          nfb_protocol: protocol
        });

        // Save protocol phases to pbm_protocols table
        try {
          await pbmProtocolAPI.createProtocol(
            phases,
            client.id,
            protocol,
            condition,
            client.first_name,
            client.last_name
          );
          console.log('PBM protocol saved successfully');

          // Refresh protocols list to show the new protocol
          const protocols = await pbmProtocolAPI.getAllProtocolsByClientId(client.id);
          setAllProtocols(protocols);
        } catch (pbmError) {
          console.error('Failed to save PBM protocol:', pbmError);
          // Continue even if PBM protocol save fails
        }

        // Refresh client data to show the updated protocol
        const updatedClient = await clientAPI.getClient(client.id.toString());
        setClient(updatedClient);
      }

      // Generate protocol label: CONDITION-MMDDYY-IN
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const year = String(now.getFullYear()).slice(-2);
      const dateStr = `${month}${day}${year}`;
      const initials = `${client.first_name.charAt(0)}${client.last_name.charAt(0)}`.toUpperCase();
      const label = `${condition}-${dateStr}-${initials}`;

      // Ensure minimum 10 second display time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 10000 - elapsedTime);

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      // Show the professional modal with phases
      setModalProtocolNumber(protocol);
      setModalProtocolPhases(phases);
      setModalProtocolLabel(label);
      setShowProtocolModal(true);
    } catch (error) {
      console.error('Error generating protocol:', error);
      alert(`Failed to extract protocol: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      clearInterval(textInterval);
      setShowProcessing(false);
      setExtractingProtocol(null);
    }
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !client) {
    return (
      <Layout title="Error">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Client not found'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={getFullName()}>
      {/* Processing Overlay */}
      {showProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-20 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <div className="w-80 h-80 sm:w-96 sm:h-96">
              <lottie-player
                src="/Wave Loading (1).json"
                background="transparent"
                speed="1"
                style={{ width: '100%', height: '100%' }}
                loop
                autoplay
              />
            </div>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900 animate-pulse mt-5">
              {processingText}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Client Information Card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Client Information
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{getFullName()}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{client.email}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Initial Condition</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{client.condition || 'Not specified'}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date Added</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {client.created_at ? new Date(client.created_at).toLocaleDateString() : 'Not available'}
                </dd>
              </div>
              {client.map_pdf_url && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">MAPS PDF</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <a
                      href={getFullPdfUrl(client.map_pdf_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View PDF
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Client Protocols Card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Client Protocols
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Treatment protocols generated for this client
              </p>
            </div>
            <div>
              <button
                onClick={() => setShowBrainMapWizard(true)}
                disabled={uploadingPdf}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingPdf ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Upload New Brain Map
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200">
            {allProtocols && allProtocols.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {allProtocols.map((protocol, index) => {
                  const isNewest = index === 0;
                  // Extract condition from label (e.g., "ANXIETY-100725-JD" -> "ANXIETY")
                  const condition = protocol.label?.split('-')[0] || 'Unknown';

                  // Find the corresponding document for this protocol by matching creation dates
                  const correspondingDoc = documents.find(doc => {
                    const docDate = new Date(doc.created_at).toDateString();
                    const protocolDate = new Date(protocol.created_at).toDateString();
                    return docDate === protocolDate;
                  });

                  return (
                    <li
                      key={protocol.id}
                      className={`px-4 py-4 sm:px-6 ${isNewest ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            {isNewest && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white mr-3">
                                Current
                              </span>
                            )}
                            <div>
                              <p className={`text-sm font-medium ${isNewest ? 'text-indigo-900' : 'text-gray-900'}`}>
                                {protocol.label}
                              </p>
                              <div className="mt-1 flex items-center space-x-4">
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium">Condition:</span> {condition}
                                </p>
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium">Date:</span> {new Date(protocol.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          {correspondingDoc && (
                            <a
                              href={getFullPdfUrl(correspondingDoc.file_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              View PDF
                            </a>
                          )}
                          <button
                            onClick={() => handleViewProtocol(protocol)}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              isNewest
                                ? 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                                : 'text-indigo-700 bg-white border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500'
                            }`}
                          >
                            View Protocol
                          </button>
                          <button
                            onClick={() => {
                              setProtocolToDelete(protocol.id);
                              setShowDeleteProtocolModal(true);
                            }}
                            className="inline-flex items-center p-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Delete Protocol"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:px-6 text-sm text-gray-500">
                <p>No protocols generated yet. Upload a Brain Map to create the first protocol.</p>
              </div>
            )}
          </div>
        </div>

        {/* CEC Results Card (if available) */}
        {client.cec_result && Object.keys(client.cec_result).length > 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                CEC Results
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(client.cec_result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => router.push('/clients')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Clients
          </button>
          <button
            onClick={() => router.push(`/clients/${client?.id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Client
          </button>
          <button
            onClick={() => setShowDeleteClientModal(true)}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Client
          </button>
        </div>
      </div>
      
      {/* Condition Selector Modal - for Re-analyzing existing PDFs */}
      <ConditionSelectorModal
        isOpen={showConditionSelector}
        onClose={() => {
          setShowConditionSelector(false);
          setPendingAnalysis(null);
        }}
        onSelect={handleConditionSelected}
        clientName={getFullName()}
      />

      {/* Brain Map Upload Wizard */}
      <BrainMapUploadWizard
        isOpen={showBrainMapWizard}
        onClose={() => setShowBrainMapWizard(false)}
        onSubmit={handleWizardSubmit}
        clientName={getFullName()}
      />

      {/* Protocol Modal */}
      <ProtocolModal
        isOpen={showProtocolModal}
        onClose={() => setShowProtocolModal(false)}
        protocolNumber={modalProtocolNumber}
        clientName={getFullName()}
        phases={modalProtocolPhases}
        protocolLabel={modalProtocolLabel}
      />

      {/* Delete Client Confirmation Modal */}
      {showDeleteClientModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteClientModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Client</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete {getFullName()}? This action cannot be undone and will permanently delete all client data, protocols, and documents.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteClient}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteClientModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Protocol Confirmation Modal */}
      {showDeleteProtocolModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteProtocolModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Protocol</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this protocol? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteProtocol}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteProtocolModal(false);
                    setProtocolToDelete(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
