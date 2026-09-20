import ProductPageN from '../../src/Components/ProductPageN';
import FeatureSection from '../../src/Components/FeatureSection';
export const metadata = { title: 'Products', description: 'Browse our hardware products and tools.', alternates: { canonical: '/products' } };
export default function ProductsPage() {
  return (
    <>
      <ProductPageN />
      <FeatureSection />
    </>
  );
}
