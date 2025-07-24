import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { clientAPI, Client, ClientDocument } from '../../lib/xano';
import ProtocolModal from '../../components/ProtocolModal';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Fetch client details
        const clientData = await clientAPI.getClient(id as string);
        console.log('Client data:', clientData);
        setClient(clientData);
        
        // Fetch client documents using client ID
        if (clientData?.id) {
          try {
            console.log('Fetching documents for client ID:', clientData.id);
            const docs = await clientAPI.getClientDocuments(clientData.id);
            console.log('Documents received:', docs);
            setDocuments(docs);
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

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !client) return;

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
      }

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      alert('Protocol document uploaded successfully!');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload protocol document. Please try again.');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleGenerateProtocol = async (documentId: number, fileUrl: string) => {
    setExtractingProtocol(documentId);
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
      
      const extractResponse = await fetch('/api/extract-protocol', {
        method: 'POST',
        body: formData,
      });
      
      if (!extractResponse.ok) {
        const error = await extractResponse.json();
        throw new Error(error.details || 'Failed to extract protocol');
      }
      
      const { protocol } = await extractResponse.json();
      console.log('Extracted protocol:', protocol);
      
      // Store the extracted protocol
      setExtractedProtocols(prev => ({ ...prev, [documentId]: protocol }));
      
      // Update the client's nfb_protocol in Xano
      if (client?.id) {
        await clientAPI.updateClient(client.id.toString(), {
          nfb_protocol: protocol
        });
        
        // Refresh client data to show the updated protocol
        const updatedClient = await clientAPI.getClient(client.id.toString());
        setClient(updatedClient);
      }
      
      // Show the professional modal
      setModalProtocolNumber(protocol);
      setShowProtocolModal(true);
    } catch (error) {
      console.error('Error generating protocol:', error);
      alert(`Failed to extract protocol: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
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
                <dt className="text-sm font-medium text-gray-500">Condition</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{client.condition || 'Not specified'}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Intake Type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{client.intake_type || 'Not specified'}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
              {client.nfb_protocol && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Assigned Protocol</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    Protocol #{client.nfb_protocol}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Client Documents Card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Client Protocol Documents
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                PDF documents uploaded for this client's protocols
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                style={{ display: 'none' }}
                disabled={uploadingPdf}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
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
                    Upload PDF
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200">
            {documents && documents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {documents
                  .sort((a, b) => b.created_at - a.created_at) // Sort by newest first
                  .map((doc) => {
                    console.log('Rendering document:', doc);
                    return (
                      <li key={doc.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Protocol Document
                              </p>
                              <p className="text-sm text-gray-500">
                                Protocol Date: {new Date(doc.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-400">
                                Uploaded: {new Date(doc.created_at).toLocaleTimeString()}
                              </p>
                              {(extractedProtocols[doc.id] || client.nfb_protocol) && (
                                <p className="text-xs text-green-600 mt-1">
                                  Protocol: #{extractedProtocols[doc.id] || client.nfb_protocol}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <a
                              href={getFullPdfUrl(doc.file_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={() => console.log('PDF URL:', getFullPdfUrl(doc.file_url))}
                            >
                              View PDF
                            </a>
                            <button
                              onClick={() => handleGenerateProtocol(doc.id, doc.file_url)}
                              disabled={extractingProtocol === doc.id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {extractingProtocol === doc.id ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Analyzing...
                                </>
                              ) : (
                                <>{extractedProtocols[doc.id] || client.nfb_protocol ? 'Re-analyze' : 'Generate Protocol'}</>
                              )}
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:px-6 text-sm text-gray-500">
                {client?.map_pdf_url ? (
                  <div>
                    <p className="mb-2">No additional protocol documents uploaded, but this client has a MAPS PDF:</p>
                    <a
                      href={getFullPdfUrl(client.map_pdf_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View MAPS PDF
                    </a>
                  </div>
                ) : (
                  'No protocol documents have been uploaded for this client yet.'
                )}
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
        </div>
      </div>
      
      {/* Protocol Modal */}
      <ProtocolModal
        isOpen={showProtocolModal}
        onClose={() => setShowProtocolModal(false)}
        protocolNumber={modalProtocolNumber}
        clientName={getFullName()}
      />
    </Layout>
  );
}
