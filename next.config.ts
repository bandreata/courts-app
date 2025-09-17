import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint errors during build (useful for Vercel deploys)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
