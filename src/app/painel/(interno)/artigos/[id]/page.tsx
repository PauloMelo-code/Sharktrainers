import { notFound } from "next/navigation";

import { EditorArtigo } from "@/components/painel/EditorArtigo";
import { buscarArtigo } from "@/lib/dados";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditarArtigoPage({ params }: Props) {
  const { id } = await params;
  const artigo = await buscarArtigo(id);
  if (!artigo) notFound();

  return (
    <>
      <h1 className="painel-titulo">Artigos</h1>
      <EditorArtigo
        artigo={{
          id: artigo.id,
          icone: artigo.icone,
          titulo: artigo.titulo,
          resumo: artigo.resumo,
          link: artigo.link,
          tags: artigo.tags,
          categoria: artigo.categoria,
          capa: artigo.capa,
          status: artigo.status,
          publicadoEm: artigo.publicadoEm,
        }}
      />
    </>
  );
}
