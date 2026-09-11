"use client";

import { useEffect, useState } from "react";

import { atualizarCurriculo, excluirCurriculo } from "@/actions/painel";
import { STATUS_CURRICULO } from "@/lib/config";

export type CurriculoFicha = {
  id: string;
  nome: string;
  cargo: string;
  cidade: string;
  telefone: string;
  email: string;
  anos: string;
  salario: string;
  linkedin: string;
  mensagem: string;
  arquivoNome: string;
  status: string;
  obs: string;
  dataLabel: string;
  vagaLabel: string;
};

export function FichaCurriculo({ curriculo }: { curriculo: CurriculoFicha }) {
  const [status, setStatus] = useState(curriculo.status);
  const [obs, setObs] = useState(curriculo.obs);
  const [salvo, setSalvo] = useState(false);

  // Ao trocar de candidato, recarrega os campos da ficha.
  useEffect(() => {
    setStatus(curriculo.status);
    setObs(curriculo.obs);
    setSalvo(false);
  }, [curriculo.id, curriculo.status, curriculo.obs]);

  async function salvar(novoStatus: string, novaObs: string) {
    const dados = new FormData();
    dados.set("id", curriculo.id);
    dados.set("status", novoStatus);
    dados.set("obs", novaObs);
    await atualizarCurriculo(dados);
    setSalvo(true);
  }

  return (
    <div className="curriculo-ficha">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ font: "800 26px/1 var(--fonte-titulo)", textTransform: "uppercase" }}>
            {curriculo.nome}
          </div>
          <div className="subtitulo" style={{ marginTop: 4 }}>
            {curriculo.cargo} · {curriculo.cidade}
          </div>
        </div>
      </div>

      <div className="ficha-dados">
        <div>
          <div className="ficha-rotulo">WhatsApp</div>
          <a href={`https://wa.me/55${curriculo.telefone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
            {curriculo.telefone}
          </a>
        </div>
        <div>
          <div className="ficha-rotulo">E-mail</div>
          <a href={`mailto:${curriculo.email}`} style={{ wordBreak: "break-all" }}>
            {curriculo.email}
          </a>
        </div>
        <div>
          <div className="ficha-rotulo">Experiência</div>
          {curriculo.anos}
        </div>
        <div>
          <div className="ficha-rotulo">Pretensão</div>
          {curriculo.salario || "—"}
        </div>
        <div>
          <div className="ficha-rotulo">LinkedIn</div>
          <span style={{ wordBreak: "break-all" }}>{curriculo.linkedin || "—"}</span>
        </div>
        <div>
          <div className="ficha-rotulo">Recebido em</div>
          {curriculo.dataLabel}
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <div className="ficha-rotulo">Vaga</div>
          {curriculo.vagaLabel}
        </div>
      </div>

      <div className="ficha-rotulo" style={{ marginBottom: 4 }}>
        Mensagem
      </div>
      <p style={{ font: "400 14px/1.5 var(--fonte)", margin: "0 0 16px" }}>
        {curriculo.mensagem || "—"}
      </p>

      <a
        href={`/api/painel/curriculos/${curriculo.id}/arquivo`}
        className="ficha-arquivo"
        download
      >
        <span className="nome">
          <img src="/assets/icons/documento.svg" alt="" />
          {curriculo.arquivoNome}
        </span>
        <span className="baixar">Baixar</span>
      </a>

      <label className="rotulo-campo" htmlFor="ficha-status">
        Status
      </label>
      <select
        id="ficha-status"
        className="entrada"
        style={{ marginBottom: 14 }}
        value={status}
        onChange={(evento) => {
          setStatus(evento.target.value);
          void salvar(evento.target.value, obs);
        }}
      >
        {STATUS_CURRICULO.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>

      <label className="rotulo-campo" htmlFor="ficha-obs">
        Observações internas
      </label>
      <textarea
        id="ficha-obs"
        rows={3}
        className="entrada"
        placeholder="Anotações só para você"
        value={obs}
        onChange={(evento) => {
          setObs(evento.target.value);
          setSalvo(false);
        }}
        onBlur={() => void salvar(status, obs)}
      />
      <div style={{ font: "400 12px var(--fonte)", color: "var(--cinza-claro)", marginTop: 6 }}>
        {salvo ? "Salvo ✓" : "Salva ao sair do campo."}
      </div>

      <form action={excluirCurriculo} style={{ marginTop: 18 }}>
        <input type="hidden" name="id" value={curriculo.id} />
        <button type="submit" className="botao-painel botao-painel-perigo">
          Excluir currículo e arquivo
        </button>
      </form>
    </div>
  );
}
