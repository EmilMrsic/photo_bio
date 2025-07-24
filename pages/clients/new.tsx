import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { clientAPI, protocolAPI, providerAPI, Client, Protocol } from '../../lib/xano';
import { useRouter } from 'next/router';

export default function NewClientPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [condition, setCondition] = useState('');
  const [intakeType, setIntakeType] = useState('Initial');
  const [notes, setNotes] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [providerId, setProviderId] = useState<number | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setPdfFile(file);
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

    try {
      // First create the client
      const newClient: Omit<Client, 'id' | 'created_at' | 'updated_at'> = {
        providers_id: providerId,
        email,
        first_name: firstName,
        last_name: lastName,
        condition: condition || undefined,
        intake_type: intakeType,
        map_pdf_url: undefined, // Will be updated after PDF upload
        notes: notes || undefined,
      };
      
      console.log('Creating client:', newClient);
      const createdClient = await clientAPI.createClient(newClient);
      console.log('Client created:', createdClient);
      
      // Then upload PDF if provided
      if (pdfFile && createdClient.id) {
        try {
          console.log('Uploading PDF for client ID:', createdClient.id);
          const uploadResult = await clientAPI.uploadMapsPDF(pdfFile, email, firstName, lastName);
          console.log('PDF upload successful:', uploadResult);
          
          // Update client with PDF URL if upload was successful
          if (uploadResult.url) {
            await clientAPI.updateClient(createdClient.id.toString(), {
              map_pdf_url: uploadResult.url
            });
          }
        } catch (uploadErr) {
          console.error('PDF upload failed:', uploadErr);
          // Continue without PDF if upload fails
        }
      }
      router.push('/clients');
    } catch (err) {
      console.error('Error creating client:', err);
      setError('Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="New Client">
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
                  Condition
                </label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a condition</option>
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

              {/* Intake Type Field */}
              <div>
                <label htmlFor="intakeType" className="block text-sm font-medium text-gray-700">
                  Intake Type
                </label>
                <select
                  id="intakeType"
                  value={intakeType}
                  onChange={(e) => setIntakeType(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Initial">Initial</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Re-assessment">Re-assessment</option>
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
                  Upload PDF Document
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
