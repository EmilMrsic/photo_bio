import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Protocol } from '../../lib/xano';

export default function SharedProtocolPage() {
  const router = useRouter();
  const { token } = router.query;
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedProtocol = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        // In a real implementation, this would fetch from your backend
        // For now, we'll show mock data
        setProtocol({
          id: 1,
          name: 'Standard Wellness Protocol',
          description: 'Basic wellness protocol for general health improvement',
          content: 'This is your personalized wellness protocol. Follow these guidelines for optimal health...',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        });
        setMessage('Your provider has shared this protocol with you. Please review it carefully and follow the guidelines.');
      } catch (err) {
        setError('Invalid or expired link');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedProtocol();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error || !protocol) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Link Not Found</h2>
              <p className="text-gray-600">{error || 'This link may have expired or been removed.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{protocol.name}</h1>
            <p className="text-lg text-gray-600">{protocol.description}</p>
          </div>
        </div>

        {/* Provider Message */}
        {message && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Message from your provider:</strong>
                </p>
                <p className="mt-1 text-sm text-blue-700">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Protocol Content */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Protocol Details</h2>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{protocol.content}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This protocol was shared with you by your healthcare provider.</p>
          <p className="mt-1">If you have any questions, please contact them directly.</p>
        </div>
      </div>
    </div>
  );
}
