import { useRouter } from 'next/router';
import ComingSoonPage from '../../components/ComingSoonPage';

export default function ClientProtocolPage() {
  const { clientId } = useRouter().query;
  const description = typeof clientId === 'string'
    ? `Detailed protocol management for client ${clientId} will be available soon.`
    : 'Detailed protocol management tools will be available soon.';

  return <ComingSoonPage title="Client Protocol" description={description} />;
}
