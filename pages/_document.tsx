import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="bg-white dark:bg-gray-900">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
      </Head>
      <body className="min-h-screen font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
