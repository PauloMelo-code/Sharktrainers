import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O Next gera arquivos de instruções para assistentes de IA na raiz do
  // projeto. Não fazem parte deste site, então ficam desligados.
  agentRules: false,

  // Currículos e fotos enviados pelo painel passam por Server Actions.
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },

  // Imagens enviadas antes da mudança ficaram gravadas no banco como
  // /uploads/arquivo. Hoje quem entrega é a rota /imagens.
  async rewrites() {
    return [{ source: "/uploads/:arquivo", destination: "/imagens/:arquivo" }];
  },
};

export default nextConfig;
