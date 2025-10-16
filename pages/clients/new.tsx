import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { clientAPI, pbmProtocolAPI, providerAPI, Client, Protocol, clearCache } from '../../lib/xano';
import { useRouter } from 'next/router';
import { CONDITIONS, CONDITION_DISPLAY_NAMES } from '../../lib/conditions';

export default function NewClientPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [providerId, setProviderId] = useState<number | null>(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchProviderInfo = async () => {
      try {
        // Get current provider info from Memberstack
        if (typeof window !== 'undefined' && (window as any).memberstack) {
          const memberstack = (window as any).memberstack;
          const member = await memberstack.getCurrentMember();
          
          if (member?.data?.auth?.email) {
            // Get provider from Xano by email
            const provider = await providerAPI.getProviderByEmail(member.data.auth.email);
            console.log('Provider lookup by email:', member.data.auth.email, 'Result:', provider);
            
            if (provider?.id) {
              setProviderId(provider.id);
            } else {
              console.error('No provider found for email:', member.data.auth.email);
              setError('Provider profile not found. Please contact support.');
            }
          }
        }
      } catch (err) {
        console.error('Failed to load provider info:', err);
      }
    };
    fetchProviderInfo();
  }, []);

  // Prevent default browser navigation when dropping files outside our dropzone
  useEffect(() => {
    const prevent = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('dragover', prevent);
    window.addEventListener('drop', prevent);
    return () => {
      window.removeEventListener('dragover', prevent);
      window.removeEventListener('drop', prevent);
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setPdfFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0] || null;
    if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      setPdfFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!providerId || !email) {
      setError('Provider information not found or email missing. Please log in again.');
      setLoading(false);
      return;
    }

    // Validate that PDF is uploaded
    if (!pdfFile) {
      setError('PDF document is required to create a client.');
      setLoading(false);
      return;
    }

    // Validate that condition is selected when PDF is uploaded
    if (pdfFile && !condition) {
      setError('Please select a condition to generate a protocol from the brain map.');
      setLoading(false);
      return;
    }

    // Show processing animation only if PDF is uploaded
    let textInterval: NodeJS.Timeout | null = null;
    if (pdfFile) {
      setShowProcessing(true);

      // Alternate between two messages every 3 seconds
      const messages = [
        `Analyzing ${firstName}'s BrainMap…`,
        `Defining the right protocol…`
      ];
      let messageIndex = 0;
      setProcessingText(messages[0]);

      textInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        setProcessingText(messages[messageIndex]);
      }, 3000);
    }

    try {
      // First create the client
      const newClient: Omit<Client, 'id' | 'created_at' | 'updated_at'> = {
        providers_id: providerId,
        email,
        first_name: firstName,
        last_name: lastName,
        condition: condition || undefined,
        map_pdf_url: undefined, // Will be updated after PDF upload
        notes: notes || undefined,
      };
      
      console.log('Creating client:', newClient);
      const createdClient = await clientAPI.createClient(newClient);
      console.log('Client created:', createdClient);
      
      // Then upload PDF and generate protocol if provided
      if (pdfFile && createdClient.id) {
        try {
          console.log('Uploading PDF for client ID:', createdClient.id);
          const uploadResult = await clientAPI.uploadMapsPDF(pdfFile, email, firstName, lastName);
          console.log('PDF upload successful:', uploadResult);

          // Update client with PDF URL/path if upload was successful
          const pdfPath = uploadResult.url || uploadResult.path;
          if (pdfPath) {
            await clientAPI.updateClient(createdClient.id.toString(), {
              map_pdf_url: pdfPath
            });
          }

          // Now generate protocol from the PDF - condition is required by form validation
          console.log('About to generate protocol. Condition:', condition, 'Client ID:', createdClient.id);

          try {
            console.log('Generating protocol for client ID:', createdClient.id);
            const protocolFormData = new FormData();
            protocolFormData.append('file', pdfFile);  // API expects 'file' not 'pdf'
            protocolFormData.append('condition', condition);
            protocolFormData.append('clientId', createdClient.id.toString());

            console.log('FormData prepared, calling /api/extract-protocol');
            const response = await fetch('/api/extract-protocol', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
              },
              body: protocolFormData,
            });

            console.log('Protocol API response status:', response.status);
            if (response.ok) {
              const result = await response.json();
              console.log('Protocol generated successfully:', result);

              if (!result.ok) {
                throw new Error(result.message || 'Failed to extract protocol');
              }

              const protocol = result.protocol_id;
              const phases = result.phases || [];

              // Update the client's nfb_protocol in Xano
              await clientAPI.updateClient(createdClient.id.toString(), {
                nfb_protocol: protocol
              });

              // Save protocol phases to pbm_protocols table
              try {
                await pbmProtocolAPI.createProtocol(
                  phases,
                  createdClient.id,
                  protocol,
                  condition,
                  firstName,
                  lastName
                );
                console.log('PBM protocol saved successfully to Xano');
              } catch (pbmError) {
                console.error('Failed to save PBM protocol:', pbmError);
                // Continue even if PBM protocol save fails
              }
            } else {
              const errorText = await response.text();
              console.error('Protocol generation failed:', errorText);
              setError('Protocol generation failed. Please try again from the client profile.');
            }
          } catch (protocolErr) {
            console.error('Error generating protocol:', protocolErr);
            setError('Error generating protocol. Please try again from the client profile.');
          }
        } catch (uploadErr) {
          console.error('PDF upload failed:', uploadErr);
          // Continue without PDF if upload fails
        }
      }

      // Clear the interval
      if (textInterval) {
        clearInterval(textInterval);
      }

      // Clear API cache so fresh data is fetched on the clients page
      clearCache('clients');

      // Redirect with new client ID to trigger onboarding
      router.push(`/clients?newClientId=${createdClient.id}&showOnboarding=true`);
    } catch (err) {
      console.error('Error creating client:', err);
      setError('Failed to create client. Please try again.');
      setShowProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="New Client">
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

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Add a New Client</h2>
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* First Name Field */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="John"
                />
              </div>

              {/* Last Name Field */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Doe"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Condition Field */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                  Condition *
                </label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a condition</option>
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {CONDITION_DISPLAY_NAMES[cond]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes Field */}
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Add any relevant notes about this client..."
                />
              </div>

              {/* PDF Upload */}
              <div className="sm:col-span-2">
                <label htmlFor="pdf" className="block text-sm font-medium text-gray-700">
                  Upload PDF Document *
                </label>
                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                    dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="pdf"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="pdf"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    {pdfFile && (
                      <p className="text-sm text-gray-900 mt-2">Selected: {pdfFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/clients')}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Client...' : 'Create Client'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
