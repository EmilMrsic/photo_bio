import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMemberstack } from '../hooks/useMemberstack';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { providerAPI } from '../lib/xano';

export default function ProfilePage() {
  const router = useRouter();
  const { member, updateMember } = useMemberstack();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    practice: '',
    practiceType: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (member) {
      console.log('Profile - Full member data:', member);
      setFormData({
        email: member?.data?.auth?.email || '',
        firstName: member?.data?.customFields?.['first-name'] || '',
        lastName: member?.data?.customFields?.['last-name'] || '',
        practice: member?.data?.customFields?.practice || '',
        practiceType: member?.data?.customFields?.['practice-type'] || '',
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      // Concatenate first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Update member information
      // Email needs to be updated separately from custom fields
      const updateData: any = {
        email: formData.email, // Email is a special field, not a custom field
        customFields: {
          'first-name': formData.firstName,
          'last-name': formData.lastName,
          name: fullName,
          practice: formData.practice,
          'practice-type': formData.practiceType,
        }
      };
      
      const result = await updateMember(updateData);

      if (result.success) {
        // Sync provider data to Xano
        try {
          console.log('Member object:', member);
          console.log('Member ID:', member?.id);
          console.log('Member data ID:', member?.data?.id);
          
          const memberstackId = member?.id || member?.data?.id || '';
          console.log('Using memberstack ID:', memberstackId);
          
          const providerData = {
            memberstack_id: memberstackId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            name: fullName,
            email: formData.email,
            practice: formData.practice,
            practice_type: formData.practiceType,
            role: member?.data?.customFields?.role || 'provider',
          };
          
          console.log('Provider data to sync:', providerData);
          
          await providerAPI.upsertProvider(providerData);
          console.log('Provider synced to Xano successfully');
        } catch (xanoError) {
          console.error('Failed to sync provider to Xano:', xanoError);
          // Continue anyway - Xano sync is not critical
        }
        
        setMessage('Profile updated successfully!');
        setMessageType('success');
      } else {
        setMessage(result.error || 'Failed to update profile');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ProtectedRoute>
      <Layout title="Profile Settings">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Personal Information
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Update your account information.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="practice" className="block text-sm font-medium text-gray-700">
                    Practice Name
                  </label>
                  <input
                    type="text"
                    name="practice"
                    id="practice"
                    required
                    value={formData.practice}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="practiceType" className="block text-sm font-medium text-gray-700">
                    Practice Type
                  </label>
                  <select
                    name="practiceType"
                    id="practiceType"
                    required
                    value={formData.practiceType}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a practice type</option>
                    <option value="chiropractic">Chiropractic</option>
                    <option value="counselor">Counselor</option>
                    <option value="therapist">Therapist</option>
                    <option value="physical-therapy">Physical Therapy</option>
                    <option value="massage-therapy">Massage Therapy</option>
                    <option value="acupuncture">Acupuncture</option>
                    <option value="naturopathy">Naturopathy</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {message && (
                  <div className={`rounded-md p-4 ${
                    messageType === 'success' ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <p className={`text-sm ${
                      messageType === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {message}
                    </p>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.push('/clients')}
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Account Information
              </h3>
              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Account Type:</span>
                  <span className="ml-2 text-sm text-gray-900 capitalize">
                    {member?.data?.customFields?.role || 'Provider'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Member Since:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {member?.data?.createdAt ? new Date(member.data.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
