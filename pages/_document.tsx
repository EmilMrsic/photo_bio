import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="bg-white dark:bg-gray-900">
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <script
          src="https://static.memberstack.com/scripts/v1/memberstack.js"
          data-memberstack-id={process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY}
          defer
        ></script>
      </Head>
      <body className="min-h-screen font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
