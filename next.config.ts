import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: 'https://api.myproperty.devateam.com/:path*',
      },
    ];
  },
};

export default nextConfig;
