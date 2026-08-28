import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "solid-cod-9679px54q774h7756-3000.app.github.dev",
      ],
    },
  },
};

export default nextConfig;
