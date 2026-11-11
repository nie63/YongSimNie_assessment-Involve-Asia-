import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep the production build optimized & hide development-only indicators
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: false,
};

export default nextConfig;
