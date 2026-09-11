import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buscarArtigo } from "@/lib/dados";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const artigo = await buscarArtigo(id);
  if (!artigo) return { title: "Artigo não encontrado" };
  return {
    title: artigo.titulo,
    description: artigo.primeiroParagrafo.slice(0, 160),
    openGraph: artigo.capa ? { images: [artigo.capa] } : undefined,
  };
}

export default async function ArtigoPage({ params }: Props) {
  const { id } = await params;
  const artigo = await buscarArtigo(id);
  if (!artigo || artigo.rascunho) notFound();

  return (
    <article className="artigo-pagina">
      <Link href="/artigos" className="link-voltar">
        ← Mural de artigos
      </Link>

      <div className="meta-artigo" style={{ margin: "28px 0 14px", fontSize: 12 }}>
        <span>{artigo.categoria}</span>
        <span className="separador">·</span>
        <span className="data">{artigo.dataLabel}</span>
      </div>

      <div className="artigo-icone">
        <img src={artigo.iconeSrc} alt="" />
      </div>

      <h1>{artigo.titulo}</h1>

      {artigo.capa && <img src={artigo.capa} alt="" className="capa" />}

      {artigo.paragrafos.map((paragrafo, indice) => (
        <p key={indice} className="paragrafo">
          {paragrafo}
        </p>
      ))}

      {artigo.link && (
        <a
          href={artigo.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primario"
          style={{ margin: "10px 0 28px" }}
        >
          Leia a matéria completa ↗
        </a>
      )}

      {artigo.tags.length > 0 && (
        <div className="tags">
          {artigo.tags.map((tag) => (
            <Link key={tag} href="/artigos" className="tag">
              {tag}
            </Link>
          ))}
        </div>
      )}

      <div className="assinatura">
        <div className="autora">
          <img src="/assets/vanessa.jpg" alt="Vanessa D'Amato" />
          <div>
            <div className="nome">Vanessa D&apos;Amato</div>
            <div className="cargo">Founder e CEO · Shark Trainers</div>
          </div>
        </div>
        <a
          href={artigo.linkCompartilhar}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-linha"
          style={{ padding: "11px 16px", minHeight: 44, fontSize: 14 }}
        >
          Compartilhar no WhatsApp
        </a>
      </div>
    </article>
  );
}
