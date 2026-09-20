export default function sitemap() {
  const routes = [
    '/', '/products', '/categories', '/about-us', '/contact-us', '/policy',
    '/terms', '/return-policy', '/shipping-policy', '/disclaimer',
  ];

  return routes.map((route) => ({
    url: new URL(route, 'https://newliyanagehardware.lk').toString(),
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
