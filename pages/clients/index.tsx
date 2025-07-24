import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { clientAPI, providerAPI, Client, ClientDocument } from '../../lib/xano';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientDocuments, setClientDocuments] = useState<Record<string, ClientDocument[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [providerId, setProviderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        setLoading(true);
        
        // Get current provider info from Memberstack
        if (typeof window !== 'undefined' && (window as any).memberstack) {
          const memberstack = (window as any).memberstack;
          const member = await memberstack.getCurrentMember();
          
          if (member?.data?.auth?.email) {
            // Performance monitoring: Provider lookup
            const providerStartTime = Date.now();
            const provider = await providerAPI.getProviderByEmail(member.data.auth.email);
            const providerLoadTime = Date.now() - providerStartTime;
            console.log(`Provider lookup completed in ${providerLoadTime}ms`);
            
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

    fetchData();
  }, []);

  return (
    <Layout title="My Clients">
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intake Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Protocol</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map(client => {
                  const clientDocs = clientDocuments[client.email] || [];
                  const latestDoc = clientDocs.length > 0 
                    ? clientDocs.reduce((latest, doc) => 
                        new Date(doc.created_at) > new Date(latest.created_at) ? doc : latest
                      )
                    : null;
                  
                  return (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link href={`/clients/${client.id}`} className="text-indigo-600 hover:text-indigo-900">
                          {client.first_name} {client.last_name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.condition || 'Not specified'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.intake_type || 'Not specified'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.nfb_protocol ? (
                          <div>
                            <div className="font-medium text-gray-900">
                              Protocol #{client.nfb_protocol}
                            </div>
                            <div className="text-xs text-gray-500">
                              {client.updated_at ? new Date(client.updated_at).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No protocol</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-3">
                          <Link 
                            href={`/clients/${client.id}`} 
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </Link>
                          <Link 
                            href={`/clients/${client.id}/edit`} 
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
    </Layout>
  );
}
