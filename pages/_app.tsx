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
          const masked = `${publicKey.slice(0, 6)}…${publicKey.slice(-4)}`;
          console.info("Memberstack: initializing with key", masked);
          console.info("Memberstack: full key length:", publicKey.length);
          console.info("Memberstack: key starts with 'pk_sb_':", publicKey.startsWith('pk_sb_'));
          const initOptions: any = { publicKey, publishableKey: publicKey };
          if (appId) {
            initOptions.appId = appId;
            console.info("Memberstack: using appId", appId);
          }
          const memberstack = memberstackDOM.default.init(initOptions);
          // Make memberstack available globally
          (window as any).memberstack = memberstack;
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
