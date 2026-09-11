"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  cargos: string[];
  ufs: string[];
  total: number;
};

/** Filtros do feed de vagas. Cada mudança atualiza a URL, então o filtro é compartilhável. */
export function FiltrosVagas({ cargos, ufs, total }: Props) {
  const router = useRouter();
  const parametros = useSearchParams();

  const cargo = parametros.get("cargo") ?? "";
  const uf = parametros.get("uf") ?? "";
  const ordem = parametros.get("ordem") ?? "recentes";

  function atualizar(chave: string, valor: string) {
    const novos = new URLSearchParams(parametros.toString());
    if (valor) novos.set(chave, valor);
    else novos.delete(chave);
    const query = novos.toString();
    router.push(query ? `/empregos?${query}` : "/empregos", { scroll: false });
  }

  return (
    <div className="filtros">
      <label className="sr-apenas" htmlFor="filtro-cargo" hidden>
        Cargo
      </label>
      <select
        id="filtro-cargo"
        value={cargo}
        onChange={(evento) => atualizar("cargo", evento.target.value)}
        aria-label="Filtrar por cargo"
      >
        <option value="">Todos os cargos</option>
        {cargos.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        value={uf}
        onChange={(evento) => atualizar("uf", evento.target.value)}
        aria-label="Filtrar por estado"
      >
        <option value="">Todos os estados</option>
        {ufs.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        value={ordem}
        onChange={(evento) => atualizar("ordem", evento.target.value)}
        aria-label="Ordenar vagas"
      >
        <option value="recentes">Mais recentes</option>
        <option value="antigas">Mais antigas</option>
      </select>

      <span className="contagem">{total} vaga(s)</span>
    </div>
  );
}
