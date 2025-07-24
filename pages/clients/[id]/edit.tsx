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
    last_name: '',
    email: '',
    condition: '',
    intake_type: '',
  });

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const clientData = await clientAPI.getClient(id as string);
        setClient(clientData);
        setFormData({
          first_name: clientData.first_name || '',
          last_name: clientData.last_name || '',
          email: clientData.email || '',
          condition: clientData.condition || '',
          intake_type: clientData.intake_type || '',
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
      [name]: value
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
        last_name: formData.last_name,
        email: formData.email,
        condition: formData.condition,
        intake_type: formData.intake_type,
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
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                  Condition
                </label>
                <select
                  name="condition"
                  id="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select condition</option>
                  <option value="Memory">Memory</option>
                  <option value="Focus">Focus</option>
                  <option value="Anxiety">Anxiety</option>
                  <option value="Depression">Depression</option>
                  <option value="Sleep">Sleep</option>
                  <option value="Head injury">Head injury</option>
                  <option value="Peak performance">Peak performance</option>
                  <option value="OCD">OCD</option>
                  <option value="Chronic pain">Chronic pain</option>
                  <option value="Spectrum">Spectrum</option>
                  <option value="Headaches">Headaches</option>
                  <option value="Stroke recovery">Stroke recovery</option>
                  <option value="Chronic fatigue">Chronic fatigue</option>
                  <option value="Addictions">Addictions</option>
                </select>
              </div>

              <div>
                <label htmlFor="intake_type" className="block text-sm font-medium text-gray-700">
                  Intake Type
                </label>
                <select
                  name="intake_type"
                  id="intake_type"
                  value={formData.intake_type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select intake type</option>
                  <option value="initial">Initial Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="assessment">Assessment</option>
                  <option value="emergency">Emergency</option>
                </select>
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
