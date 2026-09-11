import type { Metadata } from "next";

import { listarParceiros } from "@/lib/dados";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketplace — Empresas parceiras",
  description:
    "Parcerias da Shark Trainers com condições diferenciadas para a comunidade do varejo óptico.",
};

export default async function MarketplacePage() {
  const parceiros = await listarParceiros();

  return (
    <section className="container" style={{ paddingBlock: "48px 72px" }}>
      <div className="rotulo">Marketplace</div>
      <h1 className="titulo-pagina" style={{ marginBottom: 12 }}>
        Empresas parceiras
      </h1>
      <p className="texto" style={{ maxWidth: 640, marginBottom: 32 }}>
        Conheça as parcerias da Shark Trainers. Inovação e excelência em treinamento de alto nível,
        com condições diferenciadas para a comunidade Shark.
      </p>

      <div className="grade-parceiros">
        {parceiros.map((parceiro) => (
          <div key={parceiro.id} className="card-parceiro">
            <div className="marca-parceiro">
              <span>{parceiro.titulo}</span>
            </div>
            <div className="corpo">
              <div className="rotulo" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
                {parceiro.tipo}
              </div>
              <p>{parceiro.descricao}</p>
              <a
                href={parceiro.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secundario"
                style={{ fontSize: 14, padding: "13px 18px", minHeight: 0 }}
              >
                {parceiro.cta}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
