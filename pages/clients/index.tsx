import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { clientAPI, providerAPI, pbmProtocolAPI, Client, ClientDocument, PBMProtocol } from '../../lib/xano';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemberstack } from '../../hooks/useMemberstack';
import ProtocolModal from '../../components/ProtocolModal';

export default function ClientsPage() {
  const router = useRouter();
  const { loading: msLoading } = useMemberstack();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientDocuments, setClientDocuments] = useState<Record<string, ClientDocument[]>>({});
  const [clientProtocols, setClientProtocols] = useState<Record<number, PBMProtocol>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [providerId, setProviderId] = useState<number | null>(null);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<PBMProtocol | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [highlightedClientId, setHighlightedClientId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        setLoading(true);
        
        // Get current provider info from Memberstack
        if (typeof window !== 'undefined' && (window as any).memberstack) {
          const memberstack = (window as any).memberstack;
          const member = await memberstack.getCurrentMember();
          
          const memberEmail = member?.data?.auth?.email || member?.auth?.email || member?.email;
          if (memberEmail) {
            // Performance monitoring: Provider lookup
            const providerStartTime = Date.now();
            let provider;
            try {
              provider = await providerAPI.getProviderByEmail(memberEmail);
              const providerLoadTime = Date.now() - providerStartTime;
              console.log(`Provider lookup completed in ${providerLoadTime}ms`);
            } catch (error) {
              console.error('Provider lookup failed:', error);
              setError('Failed to load provider data. Please refresh the page.');
              setLoading(false);
              return;
            }
            
            if (provider?.id) {
              setProviderId(provider.id);
              
              // Performance monitoring: Clients fetch
              const clientsStartTime = Date.now();
              try {
                const clientData = await clientAPI.getClients(provider.id);
                const clientsLoadTime = Date.now() - clientsStartTime;
                console.log(`Clients API responded in ${clientsLoadTime}ms with ${clientData.length} clients`);
                
                // Extra safety: filter out any clients without provider ID or with mismatched provider ID
                const validClients = clientData.filter(client => 
                  client.providers_id && client.providers_id === provider.id
                );
                console.log(`Valid clients after filtering: ${validClients.length}`);
                setClients(validClients);

                // Fetch latest protocol for each client
                const protocolsMap: Record<number, PBMProtocol> = {};
                await Promise.all(
                  validClients.map(async (client) => {
                    if (client.id) {
                      // Get all protocols and take the most recent one (first in sorted array)
                      const protocols = await pbmProtocolAPI.getAllProtocolsByClientId(client.id);
                      if (protocols && protocols.length > 0) {
                        protocolsMap[client.id] = protocols[0]; // First one is newest
                      }
                    }
                  })
                );
                setClientProtocols(protocolsMap);

                // Check if we should show onboarding (from URL param or first time)
                const urlParams = new URLSearchParams(window.location.search);
                const shouldShowOnboarding = urlParams.get('showOnboarding') === 'true';
                const newClientId = urlParams.get('newClientId');

                if (shouldShowOnboarding && newClientId) {
                  // Coming from new client creation - highlight the new client with protocol
                  const clientId = parseInt(newClientId);
                  if (protocolsMap[clientId]) {
                    setHighlightedClientId(clientId);
                    // Clear URL params
                    window.history.replaceState({}, '', '/clients');
                    // Scroll to the highlighted row
                    setTimeout(() => {
                      const row = document.getElementById(`client-row-${clientId}`);
                      if (row) {
                        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 500);
                    // Auto-clear highlight after 5 seconds
                    setTimeout(() => {
                      setHighlightedClientId(null);
                    }, 5000);
                  }
                }
                // Remove the first-time onboarding check - no popup on login

                const totalLoadTime = Date.now() - startTime;
                console.log(`Total page load time: ${totalLoadTime}ms`);
                
                // Alert if load time is excessive
                if (totalLoadTime > 10000) {
                  console.warn(`⚠️ Excessive load time detected: ${totalLoadTime}ms. This may indicate a backend performance issue.`);
                }
              } catch (clientError) {
                console.error('Error fetching clients:', clientError);
                if (clientError instanceof Error && clientError.message.includes('timeout')) {
                  setError('The server is taking too long to respond. Please try again later.');
                } else {
                  setError('Failed to load clients. Please try again.');
                }
              }
            } else {
              console.log('No provider found for email:', member.data.auth.email);
              setError('Provider profile not found in database. Please complete your profile setup.');
            }
          } else {
            setError('Please log in to view clients.');
          }
        } else {
          setError('Memberstack not loaded. Please refresh the page.');
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        if (err instanceof Error && err.message.includes('timeout')) {
          setError('Connection timeout. The server is not responding.');
        } else {
          setError('Failed to load clients. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!msLoading) {
      fetchData();
    }
  }, [msLoading]);

  const handleViewProtocol = (client: Client, protocol: PBMProtocol) => {
    // Dismiss onboarding if showing
    if (showOnboarding) {
      setShowOnboarding(false);
      setHighlightedClientId(null);
      localStorage.setItem('hasSeenProtocolOnboarding', 'true');
    }
    setSelectedClient(client);
    setSelectedProtocol(protocol);
    setShowProtocolModal(true);
  };

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    setHighlightedClientId(null);
    localStorage.setItem('hasSeenProtocolOnboarding', 'true');
  };

  // Convert PBMProtocol to phases format for modal
  const getProtocolPhases = (protocol: PBMProtocol) => {
    return [
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
  };

  return (
    <Layout title="My Clients">
      {/* Onboarding Modal - Centered */}
      {showOnboarding && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
            onClick={dismissOnboarding}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md pointer-events-auto animate-pulse-slow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Protocol Created! 🎉
                  </h3>
                  <p className="text-base text-gray-600 mb-6">
                    Your protocol is ready and highlighted below. Click <span className="font-bold text-indigo-600">"View"</span> to see the detailed treatment plan.
                  </p>
                  <button
                    onClick={dismissOnboarding}
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-base font-semibold shadow-lg"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes highlight-pulse {
          0%, 100% {
            background-color: rgba(99, 102, 241, 0.1);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          50% {
            background-color: rgba(99, 102, 241, 0.2);
            box-shadow: 0 0 20px 10px rgba(99, 102, 241, 0.2);
          }
        }

        .highlight-row {
          animation: highlight-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Client List</h2>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <button
                type="button"
                onClick={() => router.push('/clients/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add New Client
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No clients</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new client.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 mt-4">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BrainCore ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Protocol</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map(client => {
                  const protocol = client.id ? clientProtocols[client.id] : null;
                  const displayLastInitial = (client.last_initial || client.last_name?.charAt(0) || '').toUpperCase();
                  const clientSlug = `${client.first_name}-${displayLastInitial}-${client.id}`.toLowerCase().replace(/\s+/g, '-');
                  const isHighlighted = highlightedClientId === client.id;
                  const isDimmed = highlightedClientId !== null && !isHighlighted;

                  return (
                    <tr
                      key={client.id}
                      id={`client-row-${client.id}`}
                      className={`transition-all duration-500 ${
                        isHighlighted
                          ? 'bg-indigo-50 ring-2 ring-indigo-500 shadow-lg scale-[1.02]'
                          : isDimmed
                          ? 'opacity-30'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link href={`/clients/${clientSlug}`} className="text-indigo-600 hover:text-indigo-900">
                          {client.first_name} {displayLastInitial && `${displayLastInitial}.`}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.braincore_id || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {protocol ? (
                          <div>
                            <div className="font-medium text-gray-900">
                              {protocol.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              {protocol.created_at ? new Date(protocol.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                            <button
                              onClick={() => handleViewProtocol(client, protocol)}
                              className={`text-indigo-600 hover:text-indigo-900 font-medium mt-1 transition-all ${
                                highlightedClientId === client.id
                                  ? 'text-base px-3 py-1.5 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 animate-bounce'
                                  : 'text-xs'
                              }`}
                            >
                              View
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">No protocol</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-3">
                          <Link
                            href={`/clients/${clientSlug}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </Link>
                          <Link
                            href={`/clients/${clientSlug}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Protocol Modal */}
      {selectedProtocol && selectedClient && (
        <ProtocolModal
          isOpen={showProtocolModal}
          onClose={() => setShowProtocolModal(false)}
          protocolNumber={0} // Not used when protocolLabel is provided
          clientName={`${selectedClient.first_name} ${selectedClient.last_name}`}
          phases={getProtocolPhases(selectedProtocol)}
          protocolLabel={selectedProtocol.label}
        />
      )}
    </Layout>
  );
}
