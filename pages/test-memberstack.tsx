import { useEffect, useState } from 'react';

export default function TestMemberstack() {
  const [memberstackMethods, setMemberstackMethods] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkMemberstack = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).memberstack) {
        const ms = (window as any).memberstack;
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(ms))
          .filter(name => typeof ms[name] === 'function')
          .sort();
        
        setMemberstackMethods(methods);
        setIsReady(true);
        clearInterval(checkMemberstack);
        
        console.log('Memberstack object:', ms);
        console.log('Available methods:', methods);
      }
    }, 100);

    return () => clearInterval(checkMemberstack);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Memberstack Debug</h1>
        
        <div className="mb-4">
          <p className="font-semibold">Status: {isReady ? 'Ready' : 'Loading...'}</p>
        </div>

        {isReady && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Available Methods ({memberstackMethods.length}):</h2>
            <div className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
              <ul className="space-y-1">
                {memberstackMethods.map((method) => (
                  <li key={method} className="font-mono text-sm">
                    {method}()
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Check the browser console for the full Memberstack object.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
