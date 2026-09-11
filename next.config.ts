import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Currículos e fotos enviados pelo painel passam por Server Actions.
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
