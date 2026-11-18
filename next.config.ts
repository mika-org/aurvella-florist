import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentUpgrade: 'security',
  },
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aurvellaflorist.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.aurvellaflorist.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: '/kategori/standing-vpc',
        destination: '/kategori/standing-pvc',
        permanent: true,
      },
      {
        source: '/produk/standing-vpc-grand-opening-blush',
        destination: '/produk/standing-pvc-grand-opening-blush',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
