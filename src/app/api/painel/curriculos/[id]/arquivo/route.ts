import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { curriculos } from "@/db/schema";
import { sessaoAtual } from "@/lib/sessao";
import { lerArquivo } from "@/lib/uploads";

/**
 * Entrega o arquivo de currículo. São dados pessoais: o arquivo mora fora da
 * pasta pública e só sai por aqui, com sessão válida.
 */
export async function GET(
  _requisicao: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await sessaoAtual())) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const [registro] = await db.select().from(curriculos).where(eq(curriculos.id, id)).limit(1);

  if (!registro) {
    return NextResponse.json({ erro: "Currículo não encontrado" }, { status: 404 });
  }

  // Cadastros feitos depois que o formulário deixou de pedir o anexo não têm
  // arquivo nenhum para entregar.
  if (!registro.arquivoPath) {
    return NextResponse.json(
      { erro: "Este cadastro foi feito sem anexo de currículo." },
      { status: 404 },
    );
  }

  const conteudo = await lerArquivo(registro.arquivoPath);
  if (!conteudo) {
    return NextResponse.json(
      { erro: "O arquivo não está mais no servidor." },
      { status: 404 },
    );
  }

  return new NextResponse(new Uint8Array(conteudo), {
    headers: {
      "Content-Type": registro.arquivoTipo ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(registro.arquivoNome ?? "curriculo")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
