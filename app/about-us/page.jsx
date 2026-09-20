import AboutUsNew from '../../src/Components/AboutUsNew';
import FeatureSection from '../../src/Components/FeatureSection';
export const metadata = { title: 'About Us', description: 'Learn about New Liyanage Hardware.', alternates: { canonical: '/about-us' } };
export default function AboutUsPage() {
  return (
    <>
      <AboutUsNew />
      <FeatureSection />
    </>
  );
}
