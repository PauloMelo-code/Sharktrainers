import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CardVaga } from "@/components/CardVaga";
import { FiltrosVagas } from "@/components/FiltrosVagas";
import { listarVagasFiltradas } from "@/lib/dados";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vagas abertas no setor óptico",
  description:
    "Vagas de vendedores, gerentes, optometristas e consultores ópticos em todo o Brasil, com candidatura direta pelo WhatsApp.",
};

type Props = {
  searchParams: Promise<{ cargo?: string; uf?: string; ordem?: string }>;
};

export default async function EmpregosPage({ searchParams }: Props) {
  const { cargo, uf, ordem } = await searchParams;
  const { feed, cargos, ufs } = await listarVagasFiltradas({
    cargo,
    uf,
    ordem: ordem === "antigas" ? "antigas" : "recentes",
  });

  return (
    <section className="container" style={{ paddingBlock: "48px 72px" }}>
      <div className="rotulo">Empregos</div>
      <h1 className="titulo-pagina" style={{ marginBottom: 28 }}>
        Vagas abertas no setor óptico
      </h1>

      <Suspense fallback={<div className="filtros">Carregando filtros…</div>}>
        <FiltrosVagas cargos={cargos} ufs={ufs} total={feed.length} />
      </Suspense>

      {feed.length > 0 ? (
        <div className="grade-vagas">
          {feed.map((vaga) => (
            <CardVaga key={vaga.id} vaga={vaga} />
          ))}
        </div>
      ) : (
        <div className="vazio">
          Nenhuma vaga com esses filtros.{" "}
          <Link href="/empregos" style={{ fontWeight: 700 }}>
            Limpar filtros
          </Link>
        </div>
      )}
    </section>
  );
}
