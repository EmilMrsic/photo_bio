import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="bg-white dark:bg-gray-900">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
        <script 
          data-memberstack-id={process.env.NEXT_PUBLIC_MEMBERSTACK_APP_ID} 
          src="https://static.memberstack.com/scripts/v2/memberstack.js" 
          async
        ></script>
      </Head>
      <body className="min-h-screen font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
