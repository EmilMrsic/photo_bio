import React from 'react';
import Head from 'next/head';

export default function AccountPage() {
  return (
    <>
      <Head>
        <title>Account - PhotoBio</title>
        <meta name="description" content="Account Settings" />
      </Head>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Account</h1>
            <p className="mt-4 text-lg text-gray-600">
              Account settings coming soon.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
