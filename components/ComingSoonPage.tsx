import Head from 'next/head';

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export default function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <>
      <Head>
        <title>{`${title} | Neuralight Pro`}</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-gray-50 py-16 px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
          {description && <p className="mt-4 text-gray-600">{description}</p>}
          <p className="mt-6 text-gray-500">
            This page is under construction. Please check back soon.
          </p>
        </div>
      </main>
    </>
  );
}
