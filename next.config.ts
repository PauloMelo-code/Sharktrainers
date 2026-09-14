import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O Next gera arquivos de instruções para assistentes de IA na raiz do
  // projeto. Não fazem parte deste site, então ficam desligados.
  agentRules: false,

  // Currículos e fotos enviados pelo painel passam por Server Actions.
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
