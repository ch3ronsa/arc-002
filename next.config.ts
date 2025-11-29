import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['wagmi', '@rainbow-me/rainbowkit', 'viem'],
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  // @ts-ignore - Next.js 16 deprecated these but needed for Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  // @ts-ignore - Next.js 16 deprecated these but needed for Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
