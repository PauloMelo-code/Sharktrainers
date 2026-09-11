import Link from "next/link";

import { alternarFixarVaga, alternarStatusVaga, excluirVaga } from "@/actions/painel";
import { listarVagas } from "@/lib/dados";

export const dynamic = "force-dynamic";

export default async function PainelVagas() {
  const vagas = await listarVagas();

  return (
    <>
      <h1 className="painel-titulo">Vagas</h1>

      <div className="painel-barra">
        <p className="painel-intro">
          Vagas fixadas aparecem primeiro no site. Encerre em vez de excluir para manter o histórico
          como prova social.
        </p>
        <Link href="/painel/vagas/nova" className="btn btn-primario btn-pequeno">
          + Nova vaga
        </Link>
      </div>

      {vagas.length === 0 ? (
        <div className="vazio-painel">
          Nenhuma vaga cadastrada. Comece criando a primeira em “Nova vaga”.
        </div>
      ) : (
        <div className="lista-painel">
          {vagas.map((vaga) => (
            <div
              key={vaga.id}
              className={`item-painel${vaga.encerrada ? " apagado" : ""}`}
            >
              <div className="miniatura">
                {vaga.arte ? (
                  <img src={vaga.arte} alt="" />
                ) : (
                  <div className="sem-arte">{vaga.cargo}</div>
                )}
              </div>

              <div className="principal">
                <div className="titulo">{vaga.cargo}</div>
                <div className="subtitulo">
                  {vaga.cidadesTexto} · {vaga.dataLabel}
                </div>
              </div>

              <span
                className={`etiqueta-status ${vaga.encerrada ? "etiqueta-encerrada" : "etiqueta-ativa"}`}
              >
                {vaga.statusLabel}
              </span>

              <div className="acoes">
                <Link href={`/vaga/${vaga.id}`} className="botao-painel" target="_blank">
                  Ver
                </Link>
                <Link href={`/painel/vagas/${vaga.id}`} className="botao-painel">
                  Editar
                </Link>
                <form action={alternarFixarVaga}>
                  <input type="hidden" name="id" value={vaga.id} />
                  <button
                    type="submit"
                    className={`botao-painel${vaga.fixada ? " botao-painel-ativo" : ""}`}
                  >
                    {vaga.fixada ? "Desafixar" : "Fixar no topo"}
                  </button>
                </form>
                <form action={alternarStatusVaga}>
                  <input type="hidden" name="id" value={vaga.id} />
                  <button type="submit" className="botao-painel botao-painel-escuro">
                    {vaga.encerrada ? "Reativar" : "Encerrar"}
                  </button>
                </form>
                <form action={excluirVaga}>
                  <input type="hidden" name="id" value={vaga.id} />
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
