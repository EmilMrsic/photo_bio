import Head from 'next/head'
import Script from 'next/script'

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Neuralight Pro</title>
      </Head>
      <Script
        src="https://static.memberstack.com/scripts/v1/memberstack.js"
        data-memberstack-id={process.env.NEXT_PUBLIC_MEMBERSTACK_PK}
        strategy="beforeInteractive"
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" data-ms-form="login">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
            <div>
              <button
                type="button"
                data-ms-oauth-provider="google"
                className="group relative flex w-full justify-center rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
              >
                Sign in with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
