"use client";

import { useActionState, useEffect, useRef } from "react";

import { ESTADO_PAINEL_INICIAL } from "@/actions/estado";
import { salvarParceiro } from "@/actions/painel";

export function FormularioParceiro() {
  const [estado, acao, salvando] = useActionState(salvarParceiro, ESTADO_PAINEL_INICIAL);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado.ok) formRef.current?.reset();
  }, [estado.ok]);

  return (
    <form ref={formRef} action={acao} className="painel-caixa" style={{ marginBottom: 24 }}>
      <div className="painel-caixa-titulo">Novo parceiro</div>

      <div className="linha-campos">
        <div className="campo">
          <label className="rotulo-campo" htmlFor="par-titulo">
            Nome *
          </label>
          <input id="par-titulo" name="titulo" className="entrada" placeholder="Ivision" />
        </div>
        <div className="campo">
          <label className="rotulo-campo" htmlFor="par-tipo">
            Tipo
          </label>
          <input
            id="par-tipo"
            name="tipo"
            className="entrada"
            placeholder="Tecnologia · Lentes"
          />
        </div>
        <div className="campo">
          <label className="rotulo-campo" htmlFor="par-link">
            Link
          </label>
          <input id="par-link" name="link" className="entrada" placeholder="https://" />
        </div>
        <div className="campo">
          <label className="rotulo-campo" htmlFor="par-cta">
            Texto do botão
          </label>
          <input id="par-cta" name="cta" className="entrada" defaultValue="Saiba mais" />
        </div>
        <div className="campo">
          <label className="rotulo-campo" htmlFor="par-ordem">
            Ordem
          </label>
          <input id="par-ordem" name="ordem" type="number" className="entrada" defaultValue={0} />
        </div>
      </div>

      <div className="campo" style={{ marginTop: 12 }}>
        <label className="rotulo-campo" htmlFor="par-descricao">
          Descrição
        </label>
        <textarea id="par-descricao" name="descricao" rows={3} className="entrada" />
      </div>

      {estado.erro && <div className="aviso-painel">{estado.erro}</div>}

      <button type="submit" className="btn btn-primario btn-pequeno" style={{ marginTop: 14 }} disabled={salvando}>
        {salvando ? "Salvando…" : "Adicionar parceiro"}
      </button>
    </form>
  );
}
