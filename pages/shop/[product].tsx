import { useRouter } from 'next/router';
import ComingSoonPage from '../../components/ComingSoonPage';

export default function ShopProductPage() {
  const { product } = useRouter().query;
  const description = typeof product === 'string'
    ? `Detailed information for ${product} will be available soon.`
    : 'Detailed product information will be available soon.';

  return <ComingSoonPage title="Product Details" description={description} />;
}
