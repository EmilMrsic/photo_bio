import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useMemberstack } from '../hooks/useMemberstack';

export default function VerifyPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { verifyCode } = useMemberstack();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('login_email') || '';
      if (!storedEmail) {
        router.replace('/login');
      }
      setEmail(storedEmail);
    }
  }, [router]);

  useEffect(() => {
    // Redirect if no email
    if (!email) {
      router.push('/login');
      return;
    }
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      
      // Focus last filled input or last input
      const lastFilledIndex = Math.min(index + pastedCode.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    } else {
      // Handle single character
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Move to next input if value entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    
    if (digits.length > 0) {
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (i < 6) {
          newCode[i] = digit;
        }
      });
      setCode(newCode);
      
      // Focus the last filled input or the next empty one
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      if (digits.length < 6) {
        inputRefs.current[digits.length]?.focus();
      } else {
        inputRefs.current[lastFilledIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');

    if (fullCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    // Check if user has practice field BEFORE calling verifyCode
    const hasPractice = sessionStorage.getItem('has_practice') === 'true';
    console.log('[Verify Page] Has practice:', hasPractice);

    const result = await verifyCode(fullCode);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // If user has practice, force redirect to clients immediately
      if (hasPractice) {
        console.log('[Verify Page] Forcing redirect to /clients');
        window.location.href = '/clients';
      } else {
        // Navigation handled by the hook based on role
        setLoading(false);
      }
    }
  };

  const resendCode = async () => {
    // Redirect back to login to resend
    router.push('/login');
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We sent a 6-digit code to {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                Enter verification code
              </label>
              <div className="flex justify-center space-x-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                    pattern="[0-9]"
                    inputMode="numeric"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || code.join('').length !== 6}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Didn't receive the code? </span>
              <button
                type="button"
                onClick={resendCode}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Resend
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
