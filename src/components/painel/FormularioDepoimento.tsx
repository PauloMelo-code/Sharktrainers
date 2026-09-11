"use client";

import { useActionState, useEffect, useRef } from "react";

import { ESTADO_PAINEL_INICIAL } from "@/actions/estado";
import { salvarDepoimento } from "@/actions/painel";

export function FormularioDepoimento() {
  const [estado, acao, salvando] = useActionState(salvarDepoimento, ESTADO_PAINEL_INICIAL);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado.ok) formRef.current?.reset();
  }, [estado.ok]);

  return (
    <form ref={formRef} action={acao} className="painel-caixa" style={{ marginBottom: 24 }}>
      <div className="painel-caixa-titulo">Novo depoimento</div>

      <div className="linha-campos">
        <div className="campo">
          <label className="rotulo-campo" htmlFor="dep-tipo">
            Tipo
          </label>
          <input
            id="dep-tipo"
            name="tipo"
            className="entrada"
            placeholder="Candidato recolocado"
            defaultValue="Candidato recolocado"
          />
        </div>
        <div className="campo">
          <label className="rotulo-campo" htmlFor="dep-nome">
            Nome *
          </label>
          <input id="dep-nome" name="nome" className="entrada" placeholder="Rafael Menezes" />
        </div>
        <div className="campo">
          <label className="rotulo-campo" htmlFor="dep-cargo">
            Cargo / cidade
          </label>
          <input
            id="dep-cargo"
            name="cargo"
            className="entrada"
            placeholder="Gerente de loja · Campinas SP"
          />
        </div>
        <div className="campo">
          <label className="rotulo-campo" htmlFor="dep-ordem">
            Ordem
          </label>
          <input id="dep-ordem" name="ordem" type="number" className="entrada" defaultValue={0} />
        </div>
      </div>

      <div className="campo" style={{ marginTop: 12 }}>
        <label className="rotulo-campo" htmlFor="dep-texto">
          Depoimento *
        </label>
        <textarea id="dep-texto" name="texto" rows={3} className="entrada" />
      </div>

      {estado.erro && <div className="aviso-painel">{estado.erro}</div>}

      <button type="submit" className="btn btn-primario btn-pequeno" style={{ marginTop: 14 }} disabled={salvando}>
        {salvando ? "Salvando…" : "Adicionar depoimento"}
      </button>
    </form>
  );
}
