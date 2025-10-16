import { useMemberstack } from '../hooks/useMemberstack';
import { useRouter } from 'next/router';

export default function TestLogout() {
  const { member, logout, loading } = useMemberstack();
  const router = useRouter();

  const handleLogout = async () => {
    console.log('Attempting logout...');
    await logout();
    console.log('Logout complete');
  };

  const forceLogin = () => {
    router.push('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Current Status:</h2>
          <p>Logged in: {member ? 'Yes' : 'No'}</p>
          {member && (
            <>
              <p>Email: {member.auth?.email}</p>
              <p>Role: {member.customFields?.role || 'None'}</p>
            </>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Test Logout
          </button>

          <button
            onClick={forceLogin}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Force Navigate to Login
          </button>
        </div>
      </div>
    </div>
  );
}
