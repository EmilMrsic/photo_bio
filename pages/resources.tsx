import React from 'react';
import Head from 'next/head';

export default function ResourcesPage() {
  return (
    <>
      <Head>
        <title>Resources - PhotoBio</title>
        <meta name="description" content="Resources" />
      </Head>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
            <p className="mt-4 text-lg text-gray-600">
              Resources coming soon.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
