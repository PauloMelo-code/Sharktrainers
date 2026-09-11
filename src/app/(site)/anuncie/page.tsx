import type { Metadata } from "next";

import { FormularioAnuncio } from "@/components/FormularioAnuncio";
import { PLANOS } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Anuncie Aqui",
  description:
    "Publique sua vaga no maior canal de empregos do varejo óptico: arte no padrão Shark, divulgação e triagem de currículos.",
};

export default function AnunciePage() {
  return (
    <section className="duas-colunas-form">
      <div className="coluna-texto">
        <div className="rotulo">Anuncie Aqui</div>
        <h1 className="titulo-pagina">Sua vaga no maior canal de empregos do varejo óptico</h1>
        <p className="texto" style={{ marginBottom: 28 }}>
          Preencha o pedido e retornamos pelo WhatsApp em até um dia útil com a proposta e a arte da
          vaga para aprovação.
        </p>

        <div className="planos">
          {PLANOS.map((plano) => (
            <div key={plano.titulo} className="plano">
              <div className="marcador" />
              <div>
                <h3>{plano.titulo}</h3>
                <p>{plano.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="coluna-form">
        <FormularioAnuncio />
      </div>
    </section>
  );
}
