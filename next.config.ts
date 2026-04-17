import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/gym-tracker',
  assetPrefix: '/gym-tracker/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
