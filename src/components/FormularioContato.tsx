"use client";

import { useActionState } from "react";

import { ESTADO_INICIAL } from "@/actions/estado";
import { enviarContato } from "@/actions/publico";

export function FormularioContato() {
  const [estado, acao, enviando] = useActionState(enviarContato, ESTADO_INICIAL);

  const valor = (campo: string) => estado.valores[campo] ?? "";
  const erro = (campo: string) => estado.erros[campo];

  if (estado.ok) {
    return (
      <div className="caixa-formulario">
        <div className="confirmacao">
          <div className="selo-ok">
            <span>✓</span>
          </div>
          <h2>Mensagem enviada!</h2>
          <p>Obrigado, {estado.resumo?.nome}. Respondemos em até um dia útil.</p>
          <button
            type="button"
            className="btn btn-secundario btn-pequeno"
            onClick={() => window.location.reload()}
          >
            Nova mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={acao} className="caixa-formulario" noValidate>
      <div className="grade-formulario">
        <div className="campo">
          <label className="rotulo-campo" htmlFor="ct-nome">
            Nome *
          </label>
          <input
            id="ct-nome"
            name="nome"
            className="entrada"
            defaultValue={valor("nome")}
            aria-invalid={Boolean(erro("nome"))}
            autoComplete="name"
          />
          <div className="erro-campo">{erro("nome")}</div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="ct-contato">
            E-mail ou WhatsApp *
          </label>
          <input
            id="ct-contato"
            name="contato"
            className="entrada"
            defaultValue={valor("contato")}
            aria-invalid={Boolean(erro("contato"))}
          />
          <div className="erro-campo">{erro("contato")}</div>
        </div>

        <div className="campo campo-largo">
          <label className="rotulo-campo" htmlFor="ct-mensagem">
            Mensagem *
          </label>
          <textarea
            id="ct-mensagem"
            name="mensagem"
            rows={5}
            className="entrada"
            defaultValue={valor("mensagem")}
            aria-invalid={Boolean(erro("mensagem"))}
          />
          <div className="erro-campo">{erro("mensagem")}</div>
        </div>
      </div>

      {erro("geral") && (
        <div className="aviso-envio" role="alert">
          {erro("geral")}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primario btn-bloco"
        style={{ marginTop: 20 }}
        disabled={enviando}
      >
        {enviando ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}
