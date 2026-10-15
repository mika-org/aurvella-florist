import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aurvella-florist.elevore.web.id',
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
