import CategoryBrowser from '../../../src/Components/CategoryBrowser';

export const metadata = { title: 'Categories', robots: { index: true, follow: true } };

export default function CategoryPage({ params }) {
  const slugPath = (params.slug || []).join('/');
  return <CategoryBrowser slugPath={slugPath} />;
}
