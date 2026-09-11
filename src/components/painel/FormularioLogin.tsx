"use client";

import Link from "next/link";
import { useActionState } from "react";

import { ESTADO_PAINEL_INICIAL } from "@/actions/estado";
import { entrar } from "@/actions/painel";

export function FormularioLogin({ proxima }: { proxima?: string }) {
  const [estado, acao, enviando] = useActionState(entrar, ESTADO_PAINEL_INICIAL);

  return (
    <form action={acao} className="login-caixa">
      <div className="logo">
        <img src="/assets/logo-t.png" alt="Shark Trainers" />
      </div>
      <div className="titulo">Área restrita</div>

      {proxima && <input type="hidden" name="proxima" value={proxima} />}

      <label className="rotulo-campo" htmlFor="login-usuario">
        Usuário
      </label>
      <input
        id="login-usuario"
        name="usuario"
        className="entrada"
        placeholder="vanessa"
        autoComplete="username"
        style={{ marginBottom: 14 }}
      />

      <label className="rotulo-campo" htmlFor="login-senha">
        Senha
      </label>
      <input
        id="login-senha"
        name="senha"
        type="password"
        className="entrada"
        placeholder="••••••••"
        autoComplete="current-password"
      />

      <div className="login-erro" role="alert">
        {estado.erro}
      </div>

      <button
        type="submit"
        className="btn btn-primario btn-bloco"
        style={{ marginTop: 14 }}
        disabled={enviando}
      >
        {enviando ? "Entrando…" : "Entrar"}
      </button>

      <div className="login-rodape">
        <Link href="/">Voltar ao site</Link>
      </div>
    </form>
  );
}
