import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useMemberstack } from '../../hooks/useMemberstack';

export default function ResetOnboardingPage() {
  const { member, loading, updateMember } = useMemberstack();
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const resetNow = async () => {
      try {
        if (loading) {
          setStatus('Waiting for Memberstack...');
          return;
        }
        if (!member) {
          setStatus('Not logged in. Go to /login.');
          return;
        }
        const result = await updateMember({
          customFields: {
            role: '',
            onboardingComplete: false,
            practice: '',
            'practice-type': '',
          },
        });
        if ((result as any)?.error) {
          setStatus((result as any).error);
          return;
        }
        setStatus('Onboarding fields cleared. Redirecting to /onboarding...');
        setTimeout(() => {
          window.location.href = '/onboarding';
        }, 800);
      } catch (e: any) {
        setStatus(e?.message || 'Failed to reset');
      }
    };
    resetNow();
  }, [loading, member, updateMember]);

  return (
    <Layout title="Reset Onboarding">
      <div className="p-6">
        <p className="text-gray-800">{status || 'Resetting...'}</p>
      </div>
    </Layout>
  );
}


