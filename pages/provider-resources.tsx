import Head from 'next/head'

export default function ProviderResourcesPage() {
  return (
    <>
      <Head>
        <title>Provider Resources | Neuralight Pro</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Provider Resources</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find helpful videos and guides below to get started with Neuralight Pro.
          </p>
          <ul className="list-disc list-inside text-left text-gray-700 dark:text-gray-300 space-y-2">
            <li>Onboarding walkthrough video</li>
            <li>Setup guide PDF</li>
            <li>Frequently asked questions</li>
          </ul>
        </div>
      </div>
    </>
  )
}
