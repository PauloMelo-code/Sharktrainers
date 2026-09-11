import Link from "next/link";

import { alternarStatusArtigo, excluirArtigo } from "@/actions/painel";
import { listarArtigos } from "@/lib/dados";

export const dynamic = "force-dynamic";

export default async function PainelArtigos() {
  const artigos = await listarArtigos({ incluirRascunhos: true });

  return (
    <>
      <h1 className="painel-titulo">Artigos</h1>

      <div className="painel-barra">
        <p className="painel-intro">
          Cole o post pronto e o sistema separa título, resumo, link e hashtags.
        </p>
        <Link href="/painel/artigos/novo" className="btn btn-primario btn-pequeno">
          + Novo artigo
        </Link>
      </div>

      {artigos.length === 0 ? (
        <div className="vazio-painel">Nenhum artigo cadastrado.</div>
      ) : (
        <div className="lista-painel">
          {artigos.map((artigo) => (
            <div key={artigo.id} className="item-painel">
              <div className="icone-artigo">
                <img src={artigo.iconeSrc} alt="" />
              </div>

              <div className="principal">
                <div className="titulo" style={{ fontSize: 19 }}>
                  {artigo.titulo}
                </div>
                <div className="subtitulo">
                  {artigo.categoria} · {artigo.dataLabel} · {artigo.tags.join(" ")}
                </div>
              </div>

              <span
                className={`etiqueta-status ${artigo.rascunho ? "etiqueta-rascunho" : "etiqueta-publicado"}`}
              >
                {artigo.status}
              </span>

              <div className="acoes">
                <Link href={`/artigo/${artigo.id}`} className="botao-painel" target="_blank">
                  Ver
                </Link>
                <Link href={`/painel/artigos/${artigo.id}`} className="botao-painel">
                  Editar
                </Link>
                <form action={alternarStatusArtigo}>
                  <input type="hidden" name="id" value={artigo.id} />
                  <button type="submit" className="botao-painel botao-painel-escuro">
                    {artigo.rascunho ? "Publicar" : "Voltar a rascunho"}
                  </button>
                </form>
                <form action={excluirArtigo}>
                  <input type="hidden" name="id" value={artigo.id} />
                  <button type="submit" className="botao-painel botao-painel-perigo">
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
