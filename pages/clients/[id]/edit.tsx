import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { clientAPI, Client } from '../../../lib/xano';

export default function EditClientPage() {
  const router = useRouter();
  const { id } = router.query;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_initial: '',
    braincore_id: '',
  });

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
    const fetchClient = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Extract numeric ID from slug
        const clientId = getClientIdFromSlug(id as string);
        const clientData = await clientAPI.getClient(clientId);
        setClient(clientData);
        setFormData({
          first_name: clientData.first_name || '',
          last_initial: (clientData.last_initial || clientData.last_name?.charAt(0) || '').toUpperCase(),
          braincore_id: clientData.braincore_id || '',
        });
      } catch (err) {
        console.error('Error fetching client:', err);
        setError('Failed to load client details.');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'last_initial' ? value.slice(0, 1).toUpperCase() : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client?.id) return;
    
    try {
      setSaving(true);
      setError(null);
      
      await clientAPI.updateClient(client.id.toString(), {
        first_name: formData.first_name,
        last_initial: (formData.last_initial || '').charAt(0).toUpperCase(),
        braincore_id: formData.braincore_id || undefined,
      });
      
      // Redirect back to client detail page
      router.push(`/clients/${client.id}`);
    } catch (err) {
      console.error('Error updating client:', err);
      setError('Failed to update client. Please try again.');
    } finally {
      setSaving(false);
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

  if (error && !client) {
    return (
      <Layout title="Error">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Client">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              Edit Client Information
            </h3>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="last_initial" className="block text-sm font-medium text-gray-700">
                    Last Initial
                  </label>
                  <input
                    type="text"
                    name="last_initial"
                    id="last_initial"
                    value={formData.last_initial}
                    onChange={handleInputChange}
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    maxLength={1}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="braincore_id" className="block text-sm font-medium text-gray-700">
                  BrainCore ID
                </label>
                <input
                  type="text"
                  name="braincore_id"
                  id="braincore_id"
                  value={formData.braincore_id}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>



              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push(`/clients/${client?.id}`)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
