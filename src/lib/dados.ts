/**
 * Leitura do banco para as telas públicas.
 * Cada função devolve o registro já "decorado": datas formatadas, listas
 * convertidas e links de WhatsApp prontos, para as páginas ficarem só com layout.
 */
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  artigos as tabelaArtigos,
  depoimentos as tabelaDepoimentos,
  parceiros as tabelaParceiros,
  vagas as tabelaVagas,
  type Artigo,
  type Depoimento,
  type Vaga,
} from "@/db/schema";
import { MARCA, compartilharWhatsApp, linkWhatsApp } from "@/lib/config";
import { formatarData, iniciais, ufDaCidade } from "@/lib/formato";
import { parseLista } from "@/lib/listas";

export type VagaDecorada = ReturnType<typeof decorarVaga>;
export type ArtigoDecorado = ReturnType<typeof decorarArtigo>;
export type DepoimentoDecorado = ReturnType<typeof decorarDepoimento>;

export function decorarVaga(vaga: Vaga) {
  const cidades = parseLista(vaga.cidades);
  const destaques = parseLista(vaga.destaques);
  const encerrada = vaga.status === "encerrada";

  return {
    ...vaga,
    cidades,
    destaques,
    cidadesTexto: cidades.join(" · "),
    ufs: cidades.map(ufDaCidade).filter(Boolean),
    dataLabel: formatarData(vaga.publicadaEm),
    encerrada,
    aberta: !encerrada,
    fixadaNoTopo: vaga.fixada && !encerrada,
    statusLabel: encerrada ? "Vaga encerrada" : "Vaga aberta",
    linkCandidatura: linkWhatsApp(
      `Olá! Vi a vaga de ${vaga.cargo} (${cidades.join(", ")}) no site da Shark Trainers e quero me candidatar.`,
    ),
    linkCompartilhar: (urlBase: string) =>
      compartilharWhatsApp(
        `Vaga de ${vaga.cargo} em ${cidades.join(", ")} — Shark Trainers: ${urlBase}/vaga/${vaga.id}`,
      ),
  };
}

export function decorarArtigo(artigo: Artigo) {
  const paragrafos = artigo.resumo.split(/\n\s*\n/).filter(Boolean);
  return {
    ...artigo,
    tags: parseLista(artigo.tags),
    paragrafos,
    primeiroParagrafo: paragrafos[0] ?? "",
    dataLabel: formatarData(artigo.publicadoEm),
    rascunho: artigo.status === "rascunho",
    iconeSrc: `/assets/icons/${artigo.icone || "artigo"}.svg`,
    linkCompartilhar: compartilharWhatsApp(`${artigo.titulo} — ${artigo.link}`),
  };
}

export function decorarDepoimento(depoimento: Depoimento) {
  return { ...depoimento, iniciais: iniciais(depoimento.nome) };
}

/** Ordena como o protótipo: fixadas primeiro, encerradas por último, depois por data. */
function ordenarVagas(lista: VagaDecorada[], ordem: "recentes" | "antigas" = "recentes") {
  return [...lista].sort((a, b) => {
    if (a.fixadaNoTopo !== b.fixadaNoTopo) return a.fixadaNoTopo ? -1 : 1;
    if (a.encerrada !== b.encerrada) return a.encerrada ? 1 : -1;
    const diferenca = a.publicadaEm.getTime() - b.publicadaEm.getTime();
    return ordem === "recentes" ? -diferenca : diferenca;
  });
}

export async function listarVagas() {
  const registros = await db.select().from(tabelaVagas);
  return ordenarVagas(registros.map(decorarVaga));
}

export type FiltrosVaga = {
  cargo?: string;
  uf?: string;
  ordem?: "recentes" | "antigas";
  incluirEncerradas?: boolean;
};

export async function listarVagasFiltradas(filtros: FiltrosVaga = {}) {
  const { cargo, uf, ordem = "recentes", incluirEncerradas = true } = filtros;
  const todas = await listarVagas();

  const feed = ordenarVagas(todas, ordem).filter((vaga) => {
    if (!incluirEncerradas && vaga.encerrada) return false;
    if (cargo && vaga.cargo !== cargo) return false;
    if (uf && !vaga.ufs.includes(uf)) return false;
    return true;
  });

  return {
    feed,
    cargos: [...new Set(todas.map((vaga) => vaga.cargo))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    ufs: [...new Set(todas.flatMap((vaga) => vaga.ufs))].sort(),
  };
}

/** Vagas abertas exibidas na Home. */
export async function vagasDestaque(quantidade = 3) {
  const todas = await listarVagas();
  return todas.filter((vaga) => !vaga.encerrada).slice(0, quantidade);
}

export async function buscarVaga(id: string) {
  const [vaga] = await db.select().from(tabelaVagas).where(eq(tabelaVagas.id, id)).limit(1);
  return vaga ? decorarVaga(vaga) : null;
}

export async function listarArtigos({ incluirRascunhos = false } = {}) {
  const registros = await db
    .select()
    .from(tabelaArtigos)
    .orderBy(desc(tabelaArtigos.publicadoEm));
  const decorados = registros.map(decorarArtigo);
  return incluirRascunhos ? decorados : decorados.filter((artigo) => !artigo.rascunho);
}

export async function buscarArtigo(id: string) {
  const [artigo] = await db.select().from(tabelaArtigos).where(eq(tabelaArtigos.id, id)).limit(1);
  return artigo ? decorarArtigo(artigo) : null;
}

export async function listarDepoimentos() {
  const registros = await db.select().from(tabelaDepoimentos).orderBy(tabelaDepoimentos.ordem);
  return registros.map(decorarDepoimento);
}

export async function listarParceiros() {
  return db.select().from(tabelaParceiros).orderBy(tabelaParceiros.ordem);
}

/** Credenciais da Vanessa exibidas em "Sobre nós" (conteúdo fixo do site). */
export const CREDENCIAIS = [
  "Founder e CEO da Shark Trainers (2017/Atual)",
  "Parceira e palestrante Abióptica",
  "Parceira e colunista de carreira Sindióptica-SP",
  "Embaixadora Visiolens",
  "Docente Senac Tiradentes (carta convite)",
  "Clientes em SP, RJ, RS, BA, MG, PA, ES, DF, GO, MT, AL e SC",
];

export const PASSOS = [
  {
    numero: "1",
    titulo: "Briefing da vaga",
    descricao:
      "Entendemos a loja, o perfil de cliente, a meta e a cultura do time antes de qualquer anúncio.",
  },
  {
    numero: "2",
    titulo: "Busca e triagem",
    descricao:
      "Publicamos no canal, ativamos o banco de talentos e entrevistamos com o crivo de quem já vendeu óculos.",
  },
  {
    numero: "3",
    titulo: "Apresentação e garantia",
    descricao:
      "Você recebe poucos candidatos, todos no perfil. Se não der certo, refazemos a busca.",
  },
];

export const PLANOS = [
  {
    titulo: "Publicação da vaga",
    descricao: `Arte no padrão Shark, publicação no site e no Instagram (${MARCA.instagramSeguidores}) e envio para grupos de WhatsApp do setor.`,
  },
  {
    titulo: "Headhunting completo",
    descricao:
      "Triagem, entrevistas e apresentação de candidatos no perfil, com garantia de contratação do time de vendas.",
  },
  {
    titulo: "Coach comercial",
    descricao: "Treinamento da equipe contratada nos primeiros 30 dias para acelerar resultado.",
  },
];
