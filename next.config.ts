import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        hostname: 'engram1.blob.core.windows.net',
        port: '',
        pathname: '/tuc-homepage/**',
      },
    ],
  },
};

export default nextConfig;
