/** @type {import('next').NextConfig} */
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000');

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/categories/:path*', destination: '/category/:path*', permanent: true },
      { source: '/category/:id/products', destination: '/category/:id', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', ''),
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
