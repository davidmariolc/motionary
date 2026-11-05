import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
  config options here
  */
  cacheComponents: true,
  experimental: {
    agentFeedback: true,
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        as: "*.css",
        loaders: ["@tailwindcss/turbopack"],
      },
    },
  },
};

export default nextConfig;
