import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ProductPage() {
  const router = useRouter();
  const { product } = router.query;

  return (
    <>
      <Head>
        <title>Product - PhotoBio</title>
        <meta name="description" content="Product Details" />
      </Head>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Product</h1>
            <p className="mt-4 text-lg text-gray-600">
              Product {product} details coming soon.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
