import { NextResponse } from "next/server";

import { lerImagemPublica } from "@/lib/uploads";

/** Entrega fotos de vaga e capas de artigo enviadas pelo painel. */
export async function GET(
  _requisicao: Request,
  { params }: { params: Promise<{ arquivo: string }> },
) {
  const { arquivo } = await params;
  const imagem = await lerImagemPublica(arquivo);

  if (!imagem) {
    return NextResponse.json({ erro: "Imagem não encontrada" }, { status: 404 });
  }

  // O nome leva um UUID novo a cada envio, então o arquivo nunca muda.
  return new NextResponse(new Uint8Array(imagem.conteudo), {
    headers: {
      "Content-Type": imagem.tipo,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
