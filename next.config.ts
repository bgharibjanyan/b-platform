import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  serverExternalPackages: ["mysql2"],
  experimental: {
    agentFeedback: true,
    serverActions: { bodySizeLimit: "8mb" },
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
