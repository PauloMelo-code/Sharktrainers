import type { Metadata } from "next";

import { CardArtigo } from "@/components/CardArtigo";
import { MARCA } from "@/lib/config";
import { listarArtigos } from "@/lib/dados";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artigos — Mapeamento de Vendas",
  description:
    "Resumos da coluna Mapeamento de Vendas, de Vanessa D'Amato no Sindióptica-SP, e leituras que a Shark Trainers recomenda.",
};

export default async function ArtigosPage() {
  const artigos = await listarArtigos();

  return (
    <section className="container" style={{ paddingBlock: "48px 72px" }}>
      <div className="cabecalho-coluna chanfrada">
        <img src="/assets/vanessa.jpg" alt="Vanessa D'Amato" className="retrato-pequeno" />
        <div style={{ flex: "1 1 300px" }}>
          <div className="rotulo rotulo-claro">
            Coluna Mapeamento de Vendas · Sindióptica-SP
          </div>
          <h1>Curadoria de Vanessa D&apos;Amato</h1>
          <p>
            Resumos das colunas e leituras que a Shark recomenda para quem vende, gerencia e contrata
            no varejo óptico. Textos completos no acervo do Sindióptica-SP.
          </p>
        </div>
        <a
          href={MARCA.sindioptica}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primario btn-pequeno"
        >
          Acervo completo ↗
        </a>
      </div>

      <div className="grade-artigos">
        {artigos.map((artigo) => (
          <CardArtigo key={artigo.id} artigo={artigo} />
        ))}
      </div>
    </section>
  );
}
