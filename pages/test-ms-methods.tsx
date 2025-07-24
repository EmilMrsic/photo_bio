import { useEffect, useState } from 'react';

export default function TestMSMethods() {
  const [methods, setMethods] = useState<string[]>([]);
  const [msObject, setMsObject] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).memberstack) {
        const ms = (window as any).memberstack;
        
        // Get all properties
        const allProps = [];
        for (const prop in ms) {
          if (typeof ms[prop] === 'function') {
            allProps.push(prop);
          }
        }
        
        // Also check prototype
        const proto = Object.getPrototypeOf(ms);
        if (proto) {
          for (const prop in proto) {
            if (typeof proto[prop] === 'function' && !allProps.includes(prop)) {
              allProps.push(prop);
            }
          }
        }
        
        setMethods(allProps.sort());
        setMsObject(ms);
        
        console.log('Memberstack object:', ms);
        console.log('All methods:', allProps);
        
        // Try to see what's available
        console.log('Keys:', Object.keys(ms));
        console.log('getOwnPropertyNames:', Object.getOwnPropertyNames(ms));
        
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const testLogin = async () => {
    if (!msObject) return;
    
    try {
      // Try different method names
      const email = 'test@example.com';
      
      console.log('Testing different login methods...');
      
      // Try method 1
      if (msObject.loginWithEmail) {
        console.log('Found loginWithEmail');
      }
      
      // Try method 2
      if (msObject.loginWithEmailLink) {
        console.log('Found loginWithEmailLink');
      }
      
      // Try method 3
      if (msObject.sendLoginEmail) {
        console.log('Found sendLoginEmail');
      }
      
      // Try method 4
      if (msObject.sendMagicLink) {
        console.log('Found sendMagicLink');
      }
      
      // Check auth methods
      if (msObject.auth) {
        console.log('Found auth object:', msObject.auth);
      }
      
    } catch (error) {
      console.error('Test error:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Memberstack Methods Test</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Found Methods:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {methods.length > 0 ? methods.join('\n') : 'Loading...'}
        </pre>
      </div>
      
      <button
        onClick={testLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Login Methods
      </button>
      
      <p className="mt-4 text-sm text-gray-600">
        Check the browser console for detailed information.
      </p>
    </div>
  );
}
