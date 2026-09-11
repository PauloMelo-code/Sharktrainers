import Link from "next/link";

import { indicadores, pedidosPendentes, ultimosArtigos, ultimosCurriculos } from "@/lib/painel";

export const dynamic = "force-dynamic";

export default async function PainelInicio() {
  const [numeros, curriculos, pedidos, artigos] = await Promise.all([
    indicadores(),
    ultimosCurriculos(),
    pedidosPendentes(),
    ultimosArtigos(),
  ]);

  return (
    <>
      <h1 className="painel-titulo">Início</h1>

      <div className="indicadores">
        <Link href="/painel/vagas" className="indicador indicador-preto chanfrada">
          <div className="numero">{numeros.vagasAtivas}</div>
          <div className="legenda">vagas ativas</div>
        </Link>
        <Link href="/painel/curriculos" className="indicador">
          <div className="numero">{numeros.curriculosSemana}</div>
          <div className="legenda">currículos esta semana</div>
        </Link>
        <Link href="/painel/curriculos?status=novo" className="indicador">
          <div className="numero">{numeros.curriculosNovos}</div>
          <div className="legenda">currículos sem análise</div>
        </Link>
        <Link href="/painel/anuncios" className="indicador indicador-amarelo">
          <div className="numero">{numeros.pedidosPendentes}</div>
          <div className="legenda">pedidos de anúncio pendentes</div>
        </Link>
      </div>

      <div className="painel-grade">
        <div className="painel-caixa">
          <div className="painel-caixa-titulo">
            Últimos currículos
            <Link href="/painel/curriculos">Ver todos</Link>
          </div>
          {curriculos.length === 0 && <p className="painel-intro">Nenhum currículo ainda.</p>}
          {curriculos.map((curriculo) => (
            <div key={curriculo.id} className="linha-resumo">
              <span>
                <strong>{curriculo.nome}</strong> · {curriculo.cargo}
                <div className="detalhe">
                  {curriculo.cidade} · {curriculo.dataLabel}
                </div>
              </span>
              <span className={`etiqueta-status ${curriculo.classeStatus}`}>
                {curriculo.status}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="painel-caixa">
            <div className="painel-caixa-titulo">
              Anúncios pendentes
              <Link href="/painel/anuncios">Ver todos</Link>
            </div>
            {pedidos.length === 0 && <p className="painel-intro">Nenhum pedido pendente.</p>}
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="linha-resumo">
                <span>
                  <strong>{pedido.empresa}</strong> · {pedido.cargo}
                  <div className="detalhe">
                    {pedido.cidade} · {pedido.responsavel} · {pedido.whatsapp}
                  </div>
                </span>
              </div>
            ))}
          </div>

          <div className="painel-caixa">
            <div className="painel-caixa-titulo">
              Últimos artigos
              <Link href="/painel/artigos">Ver todos</Link>
            </div>
            {artigos.length === 0 && <p className="painel-intro">Nenhum artigo ainda.</p>}
            {artigos.map((artigo) => (
              <div key={artigo.id} className="linha-resumo">
                <span>
                  {artigo.titulo}
                  <div className="detalhe">
                    {artigo.categoria} · {artigo.dataLabel} · {artigo.status}
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
