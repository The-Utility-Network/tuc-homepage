import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/industries/Governance',
        destination: '/industries/politics',
        permanent: true,
      },
      {
        source: '/industries/governance',
        destination: '/industries/politics',
        permanent: true,
      },
      {
        source: '/industries/GovTech',
        destination: '/industries/politics',
        permanent: true,
      },
      {
        source: '/industries/govtech',
        destination: '/industries/politics',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd3t3ozftmdmh3i.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/tgl_cdn/**',
      },
    ],
  },
};

export default nextConfig;
