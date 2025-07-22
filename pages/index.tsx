import Head from "next/head";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    const initMemberstack = () => {
      const ms = (window as any).MemberStack;
      if (!ms) return;

      document.getElementById("memberstack-login-google")?.addEventListener("click", () => {
        ms.loginWithOAuth("google");
      });

      document.getElementById("memberstack-login-passwordless")?.addEventListener("click", () => {
        ms.openModal("LOGIN");
      });

      ms.onReady.then(({ member }) => {
        if (member?.loggedIn) {
          const role = member.customFields?.role;
          if (role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/dashboard";
          }
        }
      });
    };

    if (typeof window !== "undefined") {
      if ((window as any).MemberStack) {
        initMemberstack();
      } else {
        document.addEventListener("DOMContentLoaded", initMemberstack);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Login — Neuralight Pro</title>
      </Head>
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img className="h-10 w-auto" src="/logo.svg" alt="Neuralight Pro" />
              <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Not a member?{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Start a free trial
                </a>
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    id="memberstack-login-google"
                    className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
                  >
                    <img src="/google.svg" alt="Google" className="h-5 w-5" />
                    Google
                  </button>
                  <button
                    id="memberstack-login-passwordless"
                    className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
                  >
                    <img src="/email-icon.svg" alt="Email" className="h-5 w-5" />
                    Email Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1908&q=80"
            alt="Background"
          />
        </div>
      </div>
    </>
  );
}