"use client";

import { useActionState } from "react";

import { ESTADO_INICIAL } from "@/actions/estado";
import { enviarPedidoAnuncio } from "@/actions/publico";
import { CARGOS } from "@/lib/config";

export function FormularioAnuncio() {
  const [estado, acao, enviando] = useActionState(enviarPedidoAnuncio, ESTADO_INICIAL);

  const valor = (campo: string) => estado.valores[campo] ?? "";
  const erro = (campo: string) => estado.erros[campo];

  if (estado.ok) {
    const resumo = estado.resumo ?? {};
    return (
      <div className="caixa-formulario">
        <div className="confirmacao">
          <div className="selo-ok">
            <span>✓</span>
          </div>
          <h2>Pedido recebido!</h2>
          <p>
            Obrigado, {resumo.responsavel}. Vamos retornar no WhatsApp {resumo.whatsapp} em até um
            dia útil.
          </p>
          <button
            type="button"
            className="btn btn-secundario btn-pequeno"
            onClick={() => window.location.reload()}
          >
            Enviar outro pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={acao} className="caixa-formulario" noValidate>
      <h2 className="titulo-bloco" style={{ fontSize: 26, marginBottom: 20 }}>
        Pedido de anúncio
      </h2>

      <div className="grade-formulario">
        <div className="campo">
          <label className="rotulo-campo" htmlFor="an-empresa">
            Empresa *
          </label>
          <input
            id="an-empresa"
            name="empresa"
            className="entrada"
            placeholder="Ótica Exemplo"
            defaultValue={valor("empresa")}
            aria-invalid={Boolean(erro("empresa"))}
          />
          <div className="erro-campo">{erro("empresa")}</div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="an-responsavel">
            Responsável *
          </label>
          <input
            id="an-responsavel"
            name="responsavel"
            className="entrada"
            placeholder="Nome de quem contrata"
            defaultValue={valor("responsavel")}
            aria-invalid={Boolean(erro("responsavel"))}
          />
          <div className="erro-campo">{erro("responsavel")}</div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="an-whatsapp">
            WhatsApp *
          </label>
          <input
            id="an-whatsapp"
            name="whatsapp"
            className="entrada"
            placeholder="(11) 99999-9999"
            defaultValue={valor("whatsapp")}
            aria-invalid={Boolean(erro("whatsapp"))}
          />
          <div className="erro-campo">{erro("whatsapp")}</div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="an-email">
            E-mail
          </label>
          <input
            id="an-email"
            name="email"
            type="email"
            className="entrada"
            placeholder="contato@otica.com.br"
            defaultValue={valor("email")}
            aria-invalid={Boolean(erro("email"))}
          />
          <div className="erro-campo">{erro("email")}</div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="an-cidade">
            Cidade / UF *
          </label>
          <input
            id="an-cidade"
            name="cidade"
            className="entrada"
            placeholder="São Paulo SP"
            defaultValue={valor("cidade")}
            aria-invalid={Boolean(erro("cidade"))}
          />
          <div className="erro-campo">{erro("cidade")}</div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="an-cargo">
            Cargo *
          </label>
          <select
            id="an-cargo"
            name="cargo"
            className="entrada"
            defaultValue={valor("cargo")}
            aria-invalid={Boolean(erro("cargo"))}
          >
            <option value="">Selecione</option>
            {CARGOS.map((cargo) => (
              <option key={cargo} value={cargo}>
                {cargo}
              </option>
            ))}
          </select>
          <div className="erro-campo">{erro("cargo")}</div>
        </div>
      </div>

      <div className="campo" style={{ marginTop: 16 }}>
        <label className="rotulo-campo" htmlFor="an-descricao">
          Descrição da vaga
        </label>
        <textarea
          id="an-descricao"
          name="descricao"
          rows={4}
          className="entrada"
          placeholder="Perfil desejado, horário, remuneração, benefícios…"
          defaultValue={valor("descricao")}
        />
      </div>

      <label className="aceite">
        <input type="checkbox" name="lgpd" defaultChecked={valor("lgpd") === "on"} />
        Autorizo a Shark Trainers a usar estes dados para retornar meu contato, conforme a LGPD.
      </label>
      <div className="erro-campo">{erro("lgpd")}</div>

      {erro("geral") && (
        <div className="aviso-envio" role="alert">
          {erro("geral")}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primario btn-bloco"
        style={{ marginTop: 22 }}
        disabled={enviando}
      >
        {enviando ? "Enviando…" : "Enviar pedido de anúncio"}
      </button>
    </form>
  );
}
