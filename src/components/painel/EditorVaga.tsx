"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { ESTADO_PAINEL_INICIAL } from "@/actions/estado";
import { salvarVaga } from "@/actions/painel";
import { ArteVaga } from "@/components/ArteVaga";
import { MARCA } from "@/lib/config";
import { baixarPng, gerarArtePng } from "@/lib/arteCanvas";
import { inputDeData } from "@/lib/formato";
import { listaDeTexto } from "@/lib/listas";

export type VagaParaEditar = {
  id: string;
  cargo: string;
  cidades: string[];
  destaques: string[];
  telefone: string;
  descricao: string;
  status: string;
  fixada: boolean;
  arte: string | null;
  foto: string | null;
  publicadaEm: Date;
};

export function EditorVaga({ vaga }: { vaga?: VagaParaEditar }) {
  const [estado, acao, salvando] = useActionState(salvarVaga, ESTADO_PAINEL_INICIAL);

  const [cargo, setCargo] = useState(vaga?.cargo ?? "");
  const [cidades, setCidades] = useState(vaga?.cidades.join(", ") ?? "");
  const [destaques, setDestaques] = useState(vaga?.destaques.join(", ") ?? "");
  const [telefone, setTelefone] = useState(vaga?.telefone ?? MARCA.telefoneArte);
  const [fotoPrevia, setFotoPrevia] = useState<string | null>(vaga?.foto ?? null);
  const [nomeFoto, setNomeFoto] = useState("");
  const [nomeArte, setNomeArte] = useState("");
  const [baixando, setBaixando] = useState(false);
  const [avisoArte, setAvisoArte] = useState("");

  const listaCidades = listaDeTexto(cidades);
  const listaDestaques = listaDeTexto(destaques).slice(0, 2);

  function aoEscolherFoto(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    setNomeFoto(arquivo?.name ?? "");
    if (!arquivo) {
      setFotoPrevia(vaga?.foto ?? null);
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => setFotoPrevia(String(leitor.result));
    leitor.readAsDataURL(arquivo);
  }

  async function baixarArte() {
    if (!cargo) {
      setAvisoArte("Preencha ao menos o cargo.");
      return;
    }
    setAvisoArte("");
    setBaixando(true);
    try {
      const png = await gerarArtePng({
        cargo,
        cidades: listaCidades,
        destaques: listaDestaques,
        telefone: telefone || MARCA.telefoneArte,
        foto: fotoPrevia,
      });
      baixarPng(png, `vaga-${cargo.toLowerCase().replace(/\s+/g, "-")}.png`);
    } catch (erro) {
      setAvisoArte(erro instanceof Error ? erro.message : "Não foi possível gerar a arte.");
    } finally {
      setBaixando(false);
    }
  }

  return (
    <div className="editor">
      <form action={acao} className="editor-form">
        {vaga && <input type="hidden" name="id" value={vaga.id} />}

        <div className="editor-topo">
          <h2>{vaga ? "Editar vaga" : "Nova vaga"}</h2>
          <Link href="/painel/vagas" className="btn-texto">
            Cancelar
          </Link>
        </div>

        <p className="painel-intro">
          Preencha os campos e a arte é montada ao lado no padrão da marca. Baixe para postar no
          WhatsApp e no Instagram, e publique no site com um clique.
        </p>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="vaga-cargo">
            Cargo *
          </label>
          <input
            id="vaga-cargo"
            name="cargo"
            className="entrada"
            placeholder="Vendedores"
            value={cargo}
            onChange={(evento) => setCargo(evento.target.value)}
          />
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="vaga-cidades">
            Cidades / UF <span className="opcional">(separe por vírgula)</span>
          </label>
          <input
            id="vaga-cidades"
            name="cidades"
            className="entrada"
            placeholder="Tubarão SC, Gravataí RS"
            value={cidades}
            onChange={(evento) => setCidades(evento.target.value)}
          />
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="vaga-destaques">
            Destaques <span className="opcional">(até 2, separe por vírgula)</span>
          </label>
          <input
            id="vaga-destaques"
            name="destaques"
            className="entrada"
            placeholder="Loja rua projeção 200k, Ganhos acima da média"
            value={destaques}
            onChange={(evento) => setDestaques(evento.target.value)}
          />
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label className="rotulo-campo" htmlFor="vaga-telefone">
              WhatsApp de contato
            </label>
            <input
              id="vaga-telefone"
              name="telefone"
              className="entrada"
              value={telefone}
              onChange={(evento) => setTelefone(evento.target.value)}
            />
          </div>
          <div className="campo">
            <label className="rotulo-campo" htmlFor="vaga-data">
              Data de publicação
            </label>
            <input
              id="vaga-data"
              name="publicadaEm"
              type="date"
              className="entrada"
              defaultValue={inputDeData(vaga?.publicadaEm ?? new Date())}
            />
          </div>
        </div>

        <div className="campo">
          <span className="rotulo-campo">Foto de fundo da arte</span>
          <label className="arquivo">
            <span className="arquivo-nome">
              {nomeFoto || (vaga?.foto ? "Foto atual mantida" : "Enviar foto (opcional)")}
            </span>
            <span className="arquivo-botao">Escolher</span>
            <input type="file" name="foto" accept="image/*" onChange={aoEscolherFoto} />
          </label>
        </div>

        <div className="campo">
          <span className="rotulo-campo">
            Arte pronta <span className="opcional">(se você já tem o card do Instagram)</span>
          </span>
          <label className="arquivo">
            <span className="arquivo-nome">
              {nomeArte || (vaga?.arte ? "Arte atual mantida" : "Enviar imagem pronta (opcional)")}
            </span>
            <span className="arquivo-botao">Escolher</span>
            <input
              type="file"
              name="arte"
              accept="image/*"
              onChange={(evento) => setNomeArte(evento.target.files?.[0]?.name ?? "")}
            />
          </label>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="vaga-descricao">
            Descrição da vaga <span className="opcional">(aparece na página da vaga)</span>
          </label>
          <textarea
            id="vaga-descricao"
            name="descricao"
            rows={4}
            className="entrada"
            defaultValue={vaga?.descricao ?? ""}
          />
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label className="rotulo-campo" htmlFor="vaga-status">
              Status
            </label>
            <select
              id="vaga-status"
              name="status"
              className="entrada"
              defaultValue={vaga?.status ?? "ativa"}
            >
              <option value="ativa">Ativa</option>
              <option value="encerrada">Encerrada</option>
            </select>
          </div>
          <label className="aceite" style={{ marginTop: 28 }}>
            <input type="checkbox" name="fixada" defaultChecked={vaga?.fixada ?? false} />
            Fixar no topo do feed
          </label>
        </div>

        {(estado.erro || avisoArte) && (
          <div className="aviso-painel">{estado.erro || avisoArte}</div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
          <button
            type="button"
            className="btn btn-secundario"
            style={{ flex: "1 1 160px", fontSize: 15, padding: "15px 18px", minHeight: 50 }}
            onClick={baixarArte}
            disabled={baixando}
          >
            {baixando ? "Gerando…" : "Baixar arte (PNG 1080×1600)"}
          </button>
          <button
            type="submit"
            className="btn btn-primario"
            style={{ flex: "1 1 160px", fontSize: 15, padding: "15px 18px", minHeight: 50 }}
            disabled={salvando}
          >
            {salvando ? "Salvando…" : vaga ? "Salvar alterações" : "Publicar no site"}
          </button>
        </div>
      </form>

      <div className="editor-previa">
        <div className="rotulo-previa">Pré-visualização · 1080×1600</div>
        <div className="moldura">
          {vaga?.arte && !nomeArte ? (
            <img
              src={vaga.arte}
              alt="Arte atual da vaga"
              style={{ display: "block", width: "100%" }}
            />
          ) : (
            <ArteVaga
              cargo={cargo}
              cidades={listaCidades}
              destaques={listaDestaques}
              telefone={telefone}
              foto={fotoPrevia}
            />
          )}
        </div>
        <p className="painel-intro" style={{ marginTop: 10, fontSize: 12 }}>
          Se você enviar uma arte pronta, ela substitui esta montagem no site.
        </p>
      </div>
    </div>
  );
}
