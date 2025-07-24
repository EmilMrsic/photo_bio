import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMemberstack } from '../hooks/useMemberstack';
import Layout from '../components/Layout';
import { providerAPI } from '../lib/xano';

export default function OnboardingPage() {
  const router = useRouter();
  const { member, updateMember, role, loading: memberLoading } = useMemberstack();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    practice: '',
    practiceType: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if user already has a role
  useEffect(() => {
    if (!memberLoading && member) {
      console.log('Onboarding - Member role:', role);
      console.log('Onboarding - Full member:', member);
      
      if (role === 'provider') {
        router.push('/clients');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [memberLoading, member, role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Concatenate first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Update member with provider role and additional info
      const result = await updateMember({
        customFields: {
          role: 'provider',
          'first-name': formData.firstName,
          'last-name': formData.lastName,
          name: fullName,
          practice: formData.practice,
          'practice-type': formData.practiceType,
          onboardingComplete: true,
        }
      });

      if (result.success) {
        // Sync provider data to Xano
        try {
          await providerAPI.upsertProvider({
            memberstack_id: member?.id || member?.data?.id || '',
            first_name: formData.firstName,
            last_name: formData.lastName,
            name: fullName,
            email: member?.data?.auth?.email || '',
            practice: formData.practice,
            practice_type: formData.practiceType,
            role: 'provider',
          });
          console.log('Provider synced to Xano successfully');
        } catch (xanoError) {
          console.error('Failed to sync provider to Xano:', xanoError);
          // Continue anyway - Xano sync is not critical for onboarding
        }
        
        // Force a page reload to ensure the new role is recognized
        window.location.href = '/clients';
      } else {
        setError(result.error || 'Failed to save information');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout title="Complete Your Profile">
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to PhotoBio
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let's set up your provider profile
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="practice" className="block text-sm font-medium text-gray-700">
                  Practice Name *
                </label>
                <input
                  type="text"
                  name="practice"
                  id="practice"
                  required
                  value={formData.practice}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Testy Chiropractic"
                />
              </div>

              <div>
                <label htmlFor="practiceType" className="block text-sm font-medium text-gray-700">
                  Practice Type *
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

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
