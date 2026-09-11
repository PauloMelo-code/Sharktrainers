import type { Metadata } from "next";

import { listarDepoimentos } from "@/lib/dados";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Depoimentos",
  description: "Quem já contratou e foi contratado pela Shark Trainers.",
};

export default async function DepoimentosPage() {
  const depoimentos = await listarDepoimentos();

  return (
    <section className="container" style={{ paddingBlock: "48px 72px" }}>
      <div className="rotulo">Depoimentos</div>
      <h1 className="titulo-pagina" style={{ marginBottom: 32 }}>
        Quem já contratou e foi contratado pela Shark
      </h1>

      <div className="grade-depoimentos">
        {depoimentos.map((depoimento) => (
          <div key={depoimento.id} className="card-depoimento">
            <div className="tipo">{depoimento.tipo}</div>
            <p>“{depoimento.texto}”</p>
            <div className="pessoa">
              <div className="avatar">{depoimento.iniciais}</div>
              <div>
                <div className="nome">{depoimento.nome}</div>
                <div className="cargo">{depoimento.cargo}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
