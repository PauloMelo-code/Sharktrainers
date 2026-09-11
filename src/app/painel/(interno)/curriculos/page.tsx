import Link from "next/link";
import { Suspense } from "react";

import { FichaCurriculo } from "@/components/painel/FichaCurriculo";
import { FiltrosCurriculos } from "@/components/painel/FiltrosCurriculos";
import { parseLista } from "@/lib/listas";
import { listarCurriculos, vagasParaVinculo } from "@/lib/painel";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ cargo?: string; status?: string; id?: string }>;
};

export default async function PainelCurriculos({ searchParams }: Props) {
  const { cargo, status, id } = await searchParams;
  const [todos, vagas] = await Promise.all([listarCurriculos(), vagasParaVinculo()]);

  const rotuloDaVaga = (vagaId: string | null) => {
    if (!vagaId) return "Cadastro espontâneo";
    const vaga = vagas.find((item) => item.id === vagaId);
    if (!vaga) return "Vaga removida";
    const cidades = parseLista(vaga.cidades);
    return cidades[0] ? `${vaga.cargo} · ${cidades[0]}` : vaga.cargo;
  };

  const filtrados = todos.filter(
    (curriculo) =>
      (!cargo || curriculo.cargo === cargo) && (!status || curriculo.status === status),
  );
  const selecionado = filtrados.find((curriculo) => curriculo.id === id) ?? null;

  const queryBase = new URLSearchParams();
  if (cargo) queryBase.set("cargo", cargo);
  if (status) queryBase.set("status", status);

  return (
    <>
      <h1 className="painel-titulo">Currículos</h1>

      <Suspense fallback={<div className="painel-filtros">Carregando filtros…</div>}>
        <FiltrosCurriculos total={filtrados.length} />
      </Suspense>

      {filtrados.length === 0 ? (
        <div className="vazio-painel">Nenhum currículo com esses filtros.</div>
      ) : (
        <div className="curriculos-layout">
          <div className="curriculos-lista">
            {filtrados.map((curriculo) => {
              const query = new URLSearchParams(queryBase);
              query.set("id", curriculo.id);
              return (
                <Link
                  key={curriculo.id}
                  href={`/painel/curriculos?${query.toString()}`}
                  scroll={false}
                  className="curriculo-linha"
                  aria-current={curriculo.id === selecionado?.id ? "true" : undefined}
                >
                  <div className="avatar avatar-pequeno" style={{ width: 40, height: 40 }}>
                    {curriculo.iniciais}
                  </div>
                  <div style={{ flex: "1 1 160px", minWidth: 0 }}>
                    <div style={{ font: "700 15px var(--fonte)" }}>{curriculo.nome}</div>
                    <div className="subtitulo">
                      {curriculo.cargo} · {curriculo.cidade} · {curriculo.anos}
                    </div>
                    <div style={{ font: "400 12px var(--fonte)", color: "var(--cinza-claro)" }}>
                      {rotuloDaVaga(curriculo.vagaId)} · {curriculo.dataLabel}
                    </div>
                  </div>
                  <span className={`etiqueta-status ${curriculo.classeStatus}`}>
                    {curriculo.status}
                  </span>
                </Link>
              );
            })}
          </div>

          {selecionado && (
            <FichaCurriculo
              curriculo={{
                id: selecionado.id,
                nome: selecionado.nome,
                cargo: selecionado.cargo,
                cidade: selecionado.cidade,
                telefone: selecionado.telefone,
                email: selecionado.email,
                anos: selecionado.anos,
                salario: selecionado.salario,
                linkedin: selecionado.linkedin,
                mensagem: selecionado.mensagem,
                arquivoNome: selecionado.arquivoNome,
                status: selecionado.status,
                obs: selecionado.obs,
                dataLabel: selecionado.dataLabel,
                vagaLabel: rotuloDaVaga(selecionado.vagaId),
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
