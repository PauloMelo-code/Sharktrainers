import type { Metadata } from "next";

import { FormularioContato } from "@/components/FormularioContato";
import { MARCA, MENSAGEM_HOME, linkWhatsApp } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Shark Trainers por WhatsApp, e-mail ou Instagram.",
};

export default function ContatoPage() {
  return (
    <section className="duas-colunas-form">
      <div className="coluna-texto">
        <div className="rotulo">Contato</div>
        <h1 className="titulo-pagina" style={{ marginBottom: 24 }}>
          Tire suas dúvidas!
        </h1>

        <div className="canais">
          <a
            href={linkWhatsApp(MENSAGEM_HOME)}
            target="_blank"
            rel="noopener noreferrer"
            className="canal"
          >
            <span className="canal-icone" style={{ background: "var(--whatsapp)", color: "#fff" }}>
              W
            </span>
            <span>
              <span className="titulo">WhatsApp</span>
              <span className="detalhe">{MARCA.whatsappExibicao}</span>
            </span>
          </a>

          <a href={`mailto:${MARCA.email}`} className="canal">
            <span
              className="canal-icone"
              style={{ background: "var(--preto)", color: "var(--amarelo)" }}
            >
              @
            </span>
            <span>
              <span className="titulo">E-mail</span>
              <span className="detalhe">{MARCA.email}</span>
            </span>
          </a>

          <a href={MARCA.instagram} target="_blank" rel="noopener noreferrer" className="canal">
            <span
              className="canal-icone"
              style={{ background: "var(--amarelo)", color: "var(--preto)" }}
            >
              IG
            </span>
            <span>
              <span className="titulo">Instagram</span>
              <span className="detalhe">
                {MARCA.instagramHandle} · {MARCA.instagramSeguidores}
              </span>
            </span>
          </a>
        </div>
      </div>

      <div className="coluna-form">
        <FormularioContato />
      </div>
    </section>
  );
}
