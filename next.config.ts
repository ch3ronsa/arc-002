import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['wagmi', '@rainbow-me/rainbowkit', 'viem'],
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding', 'react-native');
    return config;
  },
};

export default nextConfig;
