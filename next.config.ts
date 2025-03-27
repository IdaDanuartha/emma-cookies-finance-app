import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["kckicxwbegihwljknvgk.supabase.co"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;