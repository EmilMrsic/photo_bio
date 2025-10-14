import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ProtocolPage() {
  const router = useRouter();
  const { clientId } = router.query;

  return (
    <>
      <Head>
        <title>Protocol - PhotoBio</title>
        <meta name="description" content="Client Protocol" />
      </Head>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Protocol</h1>
            <p className="mt-4 text-lg text-gray-600">
              Protocol for client {clientId} coming soon.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
