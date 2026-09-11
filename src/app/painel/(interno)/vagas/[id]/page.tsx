import { notFound } from "next/navigation";

import { EditorVaga } from "@/components/painel/EditorVaga";
import { buscarVaga } from "@/lib/dados";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditarVagaPage({ params }: Props) {
  const { id } = await params;
  const vaga = await buscarVaga(id);
  if (!vaga) notFound();

  return (
    <>
      <h1 className="painel-titulo">Vagas</h1>
      <EditorVaga
        vaga={{
          id: vaga.id,
          cargo: vaga.cargo,
          cidades: vaga.cidades,
          destaques: vaga.destaques,
          telefone: vaga.telefone,
          descricao: vaga.descricao,
          status: vaga.status,
          fixada: vaga.fixada,
          arte: vaga.arte,
          foto: vaga.foto,
          publicadaEm: vaga.publicadaEm,
        }}
      />
    </>
  );
}
