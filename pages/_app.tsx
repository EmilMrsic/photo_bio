import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize Memberstack on client side only
    if (typeof window !== "undefined") {
      import("@memberstack/dom").then((memberstackDOM) => {
        const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
        const appId = process.env.NEXT_PUBLIC_MEMBERSTACK_APP_ID;
        if (!publicKey) {
          console.error(
            "Memberstack: NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY is missing. Create .env.local with your public key."
          );
          return;
        }
        try {
          const initOptions: any = { publicKey, publishableKey: publicKey };
          if (appId) {
            initOptions.appId = appId;
          }
          const memberstack = memberstackDOM.default.init(initOptions);
          (window as any).memberstack = memberstack;
          if (process.env.NODE_ENV !== 'production') {
            console.info('Memberstack initialized');
          }
        } catch (e) {
          console.error("Memberstack init failed:", e);
        }
      });
    }

    // Initialize dark mode based on user preference or system setting
    if (
      localStorage.theme === "dark" ||
      (!localStorage.theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <Component {...pageProps} />;
}
