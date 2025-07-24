import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

// Initialize Memberstack only on client side
let memberstack: any = null;

if (typeof window !== "undefined") {
  // Dynamically import and initialize Memberstack on client side only
  import("@memberstack/dom").then((memberstackDOM) => {
    memberstack = memberstackDOM.default.init({
      publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || "pk_sb_02c2d2411f1575e1f626",
    });
    // Make memberstack available globally
    (window as any).memberstack = memberstack;
  });
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
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
