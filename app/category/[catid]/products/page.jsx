import ProductPageN from '../../../../src/Components/ProductPageN';
import FeatureSection from '../../../../src/Components/FeatureSection';
export const metadata = { title: 'Category Products', robots: { index: true, follow: true } };
export default function CategoryProductsPage() {
  return (
    <>
      <ProductPageN />
      <FeatureSection />
    </>
  );
}
