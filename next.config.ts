/* eslint-disable unicorn/no-top-level-side-effects -- Framework configuration factories run once when their modules load. */
import createNextIntlPlugin from "next-intl/plugin";
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

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
