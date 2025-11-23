import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: 'standalone', // Required for Docker deployment
  images: {
    domains: [
      "lh3.googleusercontent.com",
    ],
  },
};

export default nextConfig;
