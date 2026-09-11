"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { CARGOS, STATUS_CURRICULO } from "@/lib/config";

export function FiltrosCurriculos({ total }: { total: number }) {
  const router = useRouter();
  const parametros = useSearchParams();

  function atualizar(chave: string, valor: string) {
    const novos = new URLSearchParams(parametros.toString());
    if (valor) novos.set(chave, valor);
    else novos.delete(chave);
    novos.delete("id");
    const query = novos.toString();
    router.push(query ? `/painel/curriculos?${query}` : "/painel/curriculos", { scroll: false });
  }

  return (
    <div className="painel-filtros">
      <select
        value={parametros.get("cargo") ?? ""}
        onChange={(evento) => atualizar("cargo", evento.target.value)}
        aria-label="Filtrar por cargo"
      >
        <option value="">Todos os cargos</option>
        {CARGOS.map((cargo) => (
          <option key={cargo} value={cargo}>
            {cargo}
          </option>
        ))}
      </select>

      <select
        value={parametros.get("status") ?? ""}
        onChange={(evento) => atualizar("status", evento.target.value)}
        aria-label="Filtrar por status"
      >
        <option value="">Todos os status</option>
        {STATUS_CURRICULO.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <span className="contagem">{total} currículo(s)</span>
    </div>
  );
}
