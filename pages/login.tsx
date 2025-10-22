import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useMemberstack } from '../hooks/useMemberstack';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const { login } = useMemberstack();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Clear the logout flag so the user can log in again
    if (typeof window !== 'undefined') {
      localStorage.removeItem('memberstack_logged_out');
    }

    try {
      // STEP 1: Prefetch provider data from Xano (in background)
      console.log('[Login] Prefetching provider data for:', email);
      const prefetchPromise = fetch('/api/prefetch-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).then(res => res.json()).then(data => {
        console.log('[Login] Prefetch result:', data);
        if (data.found && data.provider) {
          // Store provider data for verification page to use
          sessionStorage.setItem('prefetched_provider', JSON.stringify(data.provider));
          sessionStorage.setItem('has_practice', data.hasPractice ? 'true' : 'false');
          sessionStorage.setItem('has_onboarded', data.hasOnboarded ? 'true' : 'false');
        }
        return data;
      }).catch(err => {
        console.error('[Login] Prefetch failed:', err);
        // Don't block login on prefetch failure
        return null;
      });

      // STEP 2: Send passwordless email (parallel with prefetch)
      const result = await login(email);

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else if (result.passwordlessSent) {
        // Wait for prefetch to complete before showing success
        await prefetchPromise;

        setEmailSent(true);
        setLoading(false);
        // Store email for verification page
        sessionStorage.setItem('login_email', email);
        router.push('/verify');
      }
    } catch (error) {
      console.error('[Login] Error:', error);
      setError('Failed to send verification email');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section with Video */}
      <div className="relative pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Side - Headline */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                QEEG-driven photobiomodulation for better brain health
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Sign in to access your personalized tPBM protocols
              </p>
            </div>

            {/* Right Side - Video Embed */}
            <div className="relative w-full">
              <div className="relative w-full pb-[56.25%] rounded-2xl shadow-2xl ring-1 ring-gray-900/10 overflow-hidden bg-gray-900">
                <div id="video-container" className="absolute top-0 left-0 w-full h-full">
                  {/* Video will be loaded here when thumbnail is clicked */}
                </div>

                {/* Custom Thumbnail Overlay */}
                <div
                  id="video-thumbnail"
                  className="absolute top-0 left-0 w-full h-full cursor-pointer group z-10"
                  onClick={() => {
                    const thumbnail = document.getElementById('video-thumbnail');
                    const container = document.getElementById('video-container');
                    if (thumbnail && container) {
                      // Hide thumbnail
                      thumbnail.style.display = 'none';
                      // Load iframe with autoplay
                      container.innerHTML = `
                        <iframe
                          class="absolute top-0 left-0 w-full h-full border-0"
                          src="https://customer-f57etvnofv3kxoyh.cloudflarestream.com/4ca36ee41542c9962b04eb69e77e4790/iframe?autoplay=true"
                          title="Dr. Guy Annunziata explains QEEG-guided tPBM"
                          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                          allowfullscreen
                        ></iframe>
                      `;
                    }
                  }}
                >
                  <img
                    src="/tpbm intro video thumbnail.png"
                    alt="Video thumbnail"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Thumbnail failed to load');
                      e.currentTarget.style.backgroundColor = '#1f2937';
                    }}
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-200 shadow-xl">
                      <svg className="w-10 h-10 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!emailSent ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
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
                  {loading ? 'Sending...' : 'Continue with Email'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Check your email</h3>
              <p className="mt-1 text-sm text-gray-600">
                We've sent a verification code to {email}
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setError('');
                  }}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  try again
                </button>
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
