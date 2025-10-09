import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { providerAPI } from '../../lib/xano';
import { useMemberstack } from '../../hooks/useMemberstack';

export default function SyncProviderTest() {
  const { member, loading } = useMemberstack();
  const [log, setLog] = useState<string>('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      if (loading) return;
      try {
        if (!member?.data?.auth?.email) {
          setLog('No member/email. Go to /login');
          return;
        }
        const email = member.data.auth.email as string;
        const firstName = member?.data?.customFields?.['first-name'] || '';
        const lastName = member?.data?.customFields?.['last-name'] || '';
        const practice = member?.data?.customFields?.practice || '';
        const practiceType = member?.data?.customFields?.['practice-type'] || '';
        const name = `${firstName} ${lastName}`.trim();
        setLog('Pushing provider to Xano...');
        const upserted = await providerAPI.upsertProvider({
          memberstack_id: member?.id || member?.data?.id || '',
          first_name: firstName,
          last_name: lastName,
          name,
          email,
          practice,
          practice_type: practiceType,
          role: (member?.data?.customFields?.role as any) || 'provider',
        });
        setLog('Upsert complete. Fetching by email to verify...');
        const verified = await providerAPI.getProviderByEmail(email);
        setResult({ upserted, verified });
        setLog('Done.');
      } catch (e: any) {
        setLog(e?.message || 'Failed');
      }
    };
    run();
  }, [loading, member]);

  return (
    <Layout title="Sync Provider (Test)">
      <div className="p-6 space-y-4">
        <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">{log}</pre>
        {result && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Upserted</h3>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(result.upserted, null, 2)}</pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Verified (GET by email)</h3>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(result.verified, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}


