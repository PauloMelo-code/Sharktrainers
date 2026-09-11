"use client";

import { useActionState } from "react";

import { ESTADO_PAINEL_INICIAL } from "@/actions/estado";
import { trocarSenha } from "@/actions/painel";

export function FormularioSenha() {
  const [estado, acao, salvando] = useActionState(trocarSenha, ESTADO_PAINEL_INICIAL);

  return (
    <form action={acao} className="painel-caixa" style={{ maxWidth: 460 }}>
      <div className="painel-caixa-titulo">Trocar senha</div>

      <div className="campo" style={{ marginBottom: 12 }}>
        <label className="rotulo-campo" htmlFor="senha-atual">
          Senha atual
        </label>
        <input
          id="senha-atual"
          name="atual"
          type="password"
          className="entrada"
          autoComplete="current-password"
        />
      </div>

      <div className="campo" style={{ marginBottom: 12 }}>
        <label className="rotulo-campo" htmlFor="senha-nova">
          Nova senha <span className="opcional">(mínimo 8 caracteres)</span>
        </label>
        <input
          id="senha-nova"
          name="nova"
          type="password"
          className="entrada"
          autoComplete="new-password"
        />
      </div>

      <div className="campo">
        <label className="rotulo-campo" htmlFor="senha-confirmacao">
          Confirme a nova senha
        </label>
        <input
          id="senha-confirmacao"
          name="confirmacao"
          type="password"
          className="entrada"
          autoComplete="new-password"
        />
      </div>

      {estado.erro && <div className="aviso-painel">{estado.erro}</div>}
      {estado.ok && (
        <div className="aviso-painel" style={{ color: "var(--preto)" }}>
          Senha alterada.
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primario btn-pequeno"
        style={{ marginTop: 14 }}
        disabled={salvando}
      >
        {salvando ? "Salvando…" : "Salvar nova senha"}
      </button>
    </form>
  );
}
