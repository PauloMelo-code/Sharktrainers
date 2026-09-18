"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { ESTADO_INICIAL } from "@/actions/estado";
import { enviarCurriculo } from "@/actions/publico";
import { CARGOS, TEMPOS_EXPERIENCIA } from "@/lib/config";

type Props = {
  vagaId?: string;
  cargoSugerido?: string;
};

export function FormularioCurriculo({ vagaId, cargoSugerido }: Props) {
  const [estado, acao, enviando] = useActionState(enviarCurriculo, ESTADO_INICIAL);
  const [chaveForm, setChaveForm] = useState(0);

  const valor = (campo: string, padrao = "") => estado.valores[campo] ?? padrao;
  const erro = (campo: string) => estado.erros[campo];

  if (estado.ok) {
    const resumo = estado.resumo ?? {};
    return (
      <div className="caixa-formulario">
        <div className="confirmacao">
          <div className="selo-ok">
            <span>✓</span>
          </div>
          <h2>Currículo cadastrado!</h2>
          <p>
            {resumo.nome}, seu perfil de {resumo.cargo} já está no nosso banco de talentos. Quando
            surgir uma vaga em {resumo.cidade} compatível, falamos com você pelo WhatsApp.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/empregos" className="btn btn-secundario btn-pequeno">
              Ver vagas abertas
            </Link>
            <button
              type="button"
              className="btn btn-contorno btn-pequeno"
              onClick={() => {
                setChaveForm((valorAtual) => valorAtual + 1);
                window.location.reload();
              }}
            >
              Novo cadastro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={acao} className="caixa-formulario" key={chaveForm} noValidate>
      {vagaId && <input type="hidden" name="vagaId" value={vagaId} />}

      <div className="grade-formulario">
        <div className="campo campo-largo">
          <label className="rotulo-campo" htmlFor="cv-nome">
            Nome completo *
          </label>
          <input
            id="cv-nome"
            name="nome"
            className="entrada"
            defaultValue={valor("nome")}
            aria-invalid={Boolean(erro("nome"))}
            autoComplete="name"
          />
          <div className="erro-campo">{erro("nome")}</div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="cv-email">
            E-mail *
          </label>
          <input
            id="cv-email"
            name="email"
            type="email"
            className="entrada"
            defaultValue={valor("email")}
            aria-invalid={Boolean(erro("email"))}
            autoComplete="email"
          />
          <div className="erro-campo">{erro("email")}</div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="cv-telefone">
            Telefone / WhatsApp *
          </label>
          <input
            id="cv-telefone"
            name="telefone"
            className="entrada"
            placeholder="(11) 99999-9999"
            defaultValue={valor("telefone")}
            aria-invalid={Boolean(erro("telefone"))}
            autoComplete="tel"
          />
          <div className="erro-campo">{erro("telefone")}</div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="cv-cidade">
            Cidade / UF *
          </label>
          <input
            id="cv-cidade"
            name="cidade"
            className="entrada"
            placeholder="Campinas SP"
            defaultValue={valor("cidade")}
            aria-invalid={Boolean(erro("cidade"))}
          />
          <div className="erro-campo">{erro("cidade")}</div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="cv-cargo">
            Cargo pretendido *
          </label>
          <select
            id="cv-cargo"
            name="cargo"
            className="entrada"
            defaultValue={valor("cargo", cargoSugerido ?? "")}
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

        <div className="campo">
          <label className="rotulo-campo" htmlFor="cv-anos">
            Anos no varejo óptico *
          </label>
          <select
            id="cv-anos"
            name="anos"
            className="entrada"
            defaultValue={valor("anos")}
            aria-invalid={Boolean(erro("anos"))}
          >
            <option value="">Selecione</option>
            {TEMPOS_EXPERIENCIA.map((tempo) => (
              <option key={tempo} value={tempo}>
                {tempo}
              </option>
            ))}
          </select>
          <div className="erro-campo">{erro("anos")}</div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="cv-salario">
            Pretensão salarial <span className="opcional">(opcional)</span>
          </label>
          <input
            id="cv-salario"
            name="salario"
            className="entrada"
            placeholder="R$"
            defaultValue={valor("salario")}
          />
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="cv-linkedin">
            LinkedIn <span className="opcional">(opcional)</span>
          </label>
          <input
            id="cv-linkedin"
            name="linkedin"
            className="entrada"
            placeholder="linkedin.com/in/…"
            defaultValue={valor("linkedin")}
          />
        </div>

        <div className="campo campo-largo">
          <label className="rotulo-campo" htmlFor="cv-mensagem">
            Mensagem
          </label>
          <textarea
            id="cv-mensagem"
            name="mensagem"
            rows={3}
            className="entrada"
            placeholder="Conte em poucas linhas sua experiência com óticas."
            defaultValue={valor("mensagem")}
          />
        </div>
      </div>

      <label className="aceite">
        <input type="checkbox" name="lgpd" defaultChecked={valor("lgpd") === "on"} />
        Autorizo a Shark Trainers a armazenar os meus dados e apresentá-los a empresas do setor
        óptico, conforme a LGPD.
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
        {enviando ? "Enviando…" : "Cadastrar currículo"}
      </button>
    </form>
  );
}
