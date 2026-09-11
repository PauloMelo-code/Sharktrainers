import Link from "next/link";

import type { ArtigoDecorado } from "@/lib/dados";

export function CardArtigo({
  artigo,
  fundoClaro = false,
}: {
  artigo: ArtigoDecorado;
  fundoClaro?: boolean;
}) {
  return (
    <Link
      href={`/artigo/${artigo.id}`}
      className={`card-artigo${fundoClaro ? " card-artigo-claro" : ""}`}
    >
      {artigo.capa ? (
        <img src={artigo.capa} alt="" className="capa" />
      ) : (
        <div className="capa-icone">
          <img src={artigo.iconeSrc} alt="" />
        </div>
      )}
      <div className="card-artigo-corpo">
        <div className="meta-artigo">
          <span>{artigo.categoria}</span>
          <span className="separador">·</span>
          <span className="data">{artigo.dataLabel}</span>
        </div>
        <h3>
          <img src={artigo.iconeSrc} alt="" />
          <span>{artigo.titulo}</span>
        </h3>
        <p className="resumo-duas-linhas">{artigo.primeiroParagrafo}</p>
      </div>
    </Link>
  );
}
