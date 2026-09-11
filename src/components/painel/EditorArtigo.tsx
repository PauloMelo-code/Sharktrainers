"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { ESTADO_PAINEL_INICIAL } from "@/actions/estado";
import { salvarArtigo } from "@/actions/painel";
import { CATEGORIAS_ARTIGO, ICONES_ARTIGO } from "@/lib/config";
import { formatarData, inputDeData } from "@/lib/formato";
import { separarPost } from "@/lib/post";

export type ArtigoParaEditar = {
  id: string;
  icone: string;
  titulo: string;
  resumo: string;
  link: string;
  tags: string[];
  categoria: string;
  capa: string | null;
  status: string;
  publicadoEm: Date;
};

export function EditorArtigo({ artigo }: { artigo?: ArtigoParaEditar }) {
  const [estado, acao, salvando] = useActionState(salvarArtigo, ESTADO_PAINEL_INICIAL);

  const [bruto, setBruto] = useState("");
  const [icone, setIcone] = useState(artigo?.icone ?? "artigo");
  const [titulo, setTitulo] = useState(artigo?.titulo ?? "");
  const [resumo, setResumo] = useState(artigo?.resumo ?? "");
  const [link, setLink] = useState(artigo?.link ?? "");
  const [tags, setTags] = useState(artigo?.tags.join(" ") ?? "");
  const [categoria, setCategoria] = useState(artigo?.categoria ?? "Vendas");
  const [capaPrevia, setCapaPrevia] = useState<string | null>(artigo?.capa ?? null);
  const [nomeCapa, setNomeCapa] = useState("");

  function colarPost(texto: string) {
    setBruto(texto);
    const separado = separarPost(texto);
    if (separado.titulo) setTitulo(separado.titulo);
    if (separado.resumo) setResumo(separado.resumo);
    if (separado.link) setLink(separado.link);
    if (separado.tags) setTags(separado.tags);
  }

  function aoEscolherCapa(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    setNomeCapa(arquivo?.name ?? "");
    if (!arquivo) {
      setCapaPrevia(artigo?.capa ?? null);
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => setCapaPrevia(String(leitor.result));
    leitor.readAsDataURL(arquivo);
  }

  const iconeSrc = `/assets/icons/${icone}.svg`;
  const primeiroParagrafo = resumo.split(/\n\s*\n/)[0] || "O resumo aparece aqui em duas linhas…";

  return (
    <div className="editor">
      <form action={acao} className="editor-form">
        {artigo && <input type="hidden" name="id" value={artigo.id} />}

        <div className="editor-topo">
          <h2>{artigo ? "Editar artigo" : "Novo artigo"}</h2>
          <Link href="/painel/artigos" className="btn-texto">
            Cancelar
          </Link>
        </div>

        <div className="caixa-colar">
          <label className="rotulo-campo" htmlFor="art-bruto">
            1. Cole o post aqui
          </label>
          <textarea
            id="art-bruto"
            rows={7}
            className="entrada"
            value={bruto}
            onChange={(evento) => colarPost(evento.target.value)}
            placeholder={
              "E agora choveu, as vendas encolheram?\n\nParágrafo 1…\n\nParágrafo 2…\n\nLeia a matéria completa: https://…\n#vendas #varejooptico"
            }
          />
          <div className="dica">
            Primeira linha vira o título, linhas com http viram o link, #hashtags viram tags.
          </div>
        </div>

        <div style={{ font: "700 13px var(--fonte)" }}>2. Confira e ajuste</div>

        <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 12 }}>
          <div className="campo">
            <label className="rotulo-campo" htmlFor="art-icone">
              Ícone
            </label>
            <select
              id="art-icone"
              name="icone"
              className="entrada"
              value={icone}
              onChange={(evento) => setIcone(evento.target.value)}
            >
              {ICONES_ARTIGO.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.rotulo}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label className="rotulo-campo" htmlFor="art-titulo">
              Título *
            </label>
            <input
              id="art-titulo"
              name="titulo"
              className="entrada"
              value={titulo}
              onChange={(evento) => setTitulo(evento.target.value)}
            />
          </div>
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="art-resumo">
            Resumo <span className="opcional">(uma linha em branco separa os parágrafos)</span>
          </label>
          <textarea
            id="art-resumo"
            name="resumo"
            rows={5}
            className="entrada"
            value={resumo}
            onChange={(evento) => setResumo(evento.target.value)}
          />
        </div>

        <div className="campo">
          <label className="rotulo-campo" htmlFor="art-link">
            Link externo (matéria completa)
          </label>
          <input
            id="art-link"
            name="link"
            className="entrada"
            placeholder="https://"
            value={link}
            onChange={(evento) => setLink(evento.target.value)}
          />
        </div>

        <div className="campo">
          <span className="rotulo-campo">Capa do artigo</span>
          <label className="arquivo">
            <span className="arquivo-nome">
              {nomeCapa || (artigo?.capa ? "Capa atual mantida" : "Enviar imagem (opcional)")}
            </span>
            <span className="arquivo-botao">Escolher</span>
            <input type="file" name="capa" accept="image/*" onChange={aoEscolherCapa} />
          </label>
        </div>

        <div className="linha-campos">
          <div className="campo">
            <label className="rotulo-campo" htmlFor="art-tags">
              Tags
            </label>
            <input
              id="art-tags"
              name="tags"
              className="entrada"
              placeholder="#vendas #otica"
              value={tags}
              onChange={(evento) => setTags(evento.target.value)}
            />
          </div>
          <div className="campo">
            <label className="rotulo-campo" htmlFor="art-categoria">
              Categoria
            </label>
            <select
              id="art-categoria"
              name="categoria"
              className="entrada"
              value={categoria}
              onChange={(evento) => setCategoria(evento.target.value)}
            >
              {CATEGORIAS_ARTIGO.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label className="rotulo-campo" htmlFor="art-status">
              Status
            </label>
            <select
              id="art-status"
              name="status"
              className="entrada"
              defaultValue={artigo?.status ?? "publicado"}
            >
              <option value="publicado">Publicado</option>
              <option value="rascunho">Rascunho</option>
            </select>
          </div>
          <div className="campo">
            <label className="rotulo-campo" htmlFor="art-data">
              Data
            </label>
            <input
              id="art-data"
              name="publicadoEm"
              type="date"
              className="entrada"
              defaultValue={inputDeData(artigo?.publicadoEm ?? new Date())}
            />
          </div>
        </div>

        {estado.erro && <div className="aviso-painel">{estado.erro}</div>}

        <button type="submit" className="btn btn-primario" disabled={salvando}>
          {salvando ? "Salvando…" : "Salvar artigo"}
        </button>
      </form>

      <div className="editor-previa">
        <div className="rotulo-previa">Pré-visualização do card</div>
        <div className="card-artigo" style={{ display: "block" }}>
          {capaPrevia ? (
            <img src={capaPrevia} alt="" className="capa" />
          ) : (
            <div className="capa-icone">
              <img src={iconeSrc} alt="" />
            </div>
          )}
          <div className="card-artigo-corpo">
            <div className="meta-artigo">
              <span>{categoria}</span>
              <span className="separador">·</span>
              <span className="data">
                {formatarData(artigo?.publicadoEm ?? new Date())}
              </span>
            </div>
            <h3>
              <img src={iconeSrc} alt="" />
              <span>{titulo || "Título do post"}</span>
            </h3>
            <p className="resumo-duas-linhas">{primeiroParagrafo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
