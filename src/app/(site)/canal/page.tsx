import type { Metadata } from "next";
import Link from "next/link";

import { MARCA } from "@/lib/config";

export const metadata: Metadata = {
  title: "Canal de Empregos Óptica",
  description:
    "A vitrine de vagas do varejo óptico. As óticas anunciam, a Shark Trainers filtra e apresenta os candidatos certos.",
};

export default function CanalPage() {
  return (
    <section className="container" style={{ paddingBlock: "56px 72px" }}>
      <div className="rotulo">Canal de Empregos Óptica</div>
      <h1 className="titulo-pagina" style={{ maxWidth: 820 }}>
        A vitrine de vagas do varejo óptico, com o crivo de quem conhece o balcão
      </h1>
      <p className="texto" style={{ fontSize: 18, maxWidth: 720, marginBottom: 40 }}>
        Publicamos as vagas dos nossos clientes em todo o Brasil. As óticas anunciam, nós filtramos
        e apresentamos os candidatos certos. Os candidatos acompanham o canal e se candidatam direto
        pelo WhatsApp.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        <div className="bloco-preto chanfrada" style={{ padding: 32, ["--chanfro" as string]: "16px" }}>
          <div className="rotulo rotulo-claro">Para óticas e joalherias</div>
          <h2 className="titulo-bloco">Divulgue sua vaga para 40 mil profissionais do setor</h2>
          <p style={{ fontSize: 15, lineHeight: 1.55, marginBottom: 22 }}>
            Arte da vaga no padrão Shark, publicação no site, Instagram e grupos de WhatsApp,
            triagem dos currículos e garantia de contratação do time de vendas.
          </p>
          <Link href="/anuncie" className="btn btn-primario btn-pequeno">
            Anuncie Aqui
          </Link>
        </div>

        <div
          style={{
            background: "var(--branco)",
            border: "1px solid var(--borda)",
            padding: 32,
            borderRadius: 6,
          }}
        >
          <div className="rotulo">Para candidatos</div>
          <h2 className="titulo-bloco">
            Entre no banco de talentos e seja indicado antes da vaga abrir
          </h2>
          <p className="texto-pequeno" style={{ marginBottom: 22 }}>
            Vendedores, gerentes, optometristas e consultores. Cadastre seu currículo uma vez e
            receba as oportunidades da sua cidade.
          </p>
          <Link href="/curriculo" className="btn btn-secundario btn-pequeno">
            Cadastrar Currículo
          </Link>
        </div>
      </div>

      <p className="texto-pequeno" style={{ marginTop: 32 }}>
        Acompanhe também as vagas no Instagram{" "}
        <a href={MARCA.instagram} target="_blank" rel="noopener noreferrer">
          {MARCA.instagramHandle}
        </a>
        .
      </p>

      <div style={{ marginTop: 40 }}>
        <Link href="/empregos" className="btn btn-primario">
          Ver vagas no canal
        </Link>
      </div>
    </section>
  );
}
