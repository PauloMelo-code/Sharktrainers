"use server";

import { randomUUID } from "node:crypto";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { EstadoPainel } from "@/actions/estado";
import { db } from "@/db";
import {
  artigos,
  curriculos,
  depoimentos,
  mensagens,
  parceiros,
  pedidosAnuncio,
  usuarios,
  vagas,
} from "@/db/schema";
import { MARCA } from "@/lib/config";
import { dataDeInput } from "@/lib/formato";
import { listaDeTexto, serializaLista } from "@/lib/listas";
import { abrirSessao, encerrarSessao, exigirSessao } from "@/lib/sessao";
import { apagarArquivo, salvarImagemPublica } from "@/lib/uploads";

function textoDe(dados: FormData, campo: string) {
  const valor = dados.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

function marcadoEm(dados: FormData, campo: string) {
  return dados.get(campo) === "on" || dados.get(campo) === "true";
}

function arquivoDe(dados: FormData, campo: string): File | null {
  const valor = dados.get(campo);
  return valor instanceof File && valor.size > 0 ? valor : null;
}

/** Revalida as telas públicas afetadas por uma mudança no painel. */
function revalidarPublico(...caminhos: string[]) {
  for (const caminho of ["/", ...caminhos]) revalidatePath(caminho);
}

/* ------------------------------- Sessão --------------------------------- */

export async function entrar(_estado: EstadoPainel, dados: FormData): Promise<EstadoPainel> {
  const usuario = textoDe(dados, "usuario").toLowerCase();
  const senha = textoDe(dados, "senha");
  const proxima = textoDe(dados, "proxima");

  if (!usuario || !senha) return { erro: "Informe usuário e senha." };

  const [registro] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.usuario, usuario))
    .limit(1);

  // Compara sempre, mesmo sem usuário, para não revelar quais usuários existem.
  const hashComparacao = registro?.senhaHash ?? "$2b$12$invalidoinvalidoinvalidoinvalidoinvalidoinv";
  const confere = await bcrypt.compare(senha, hashComparacao);

  if (!registro || !confere) {
    return { erro: "Usuário ou senha incorretos." };
  }

  await abrirSessao({ id: registro.id, usuario: registro.usuario, nome: registro.nome });
  redirect(proxima && proxima.startsWith("/painel") ? proxima : "/painel");
}

export async function sair() {
  await encerrarSessao();
  redirect("/painel/login");
}

export async function trocarSenha(_estado: EstadoPainel, dados: FormData): Promise<EstadoPainel> {
  const sessao = await exigirSessao();
  const atual = textoDe(dados, "atual");
  const nova = textoDe(dados, "nova");
  const confirmacao = textoDe(dados, "confirmacao");

  if (nova.length < 8) return { erro: "A nova senha precisa ter pelo menos 8 caracteres." };
  if (nova !== confirmacao) return { erro: "A confirmação não bate com a nova senha." };

  const [registro] = await db.select().from(usuarios).where(eq(usuarios.id, sessao.id)).limit(1);
  if (!registro || !(await bcrypt.compare(atual, registro.senhaHash))) {
    return { erro: "Senha atual incorreta." };
  }

  await db
    .update(usuarios)
    .set({ senhaHash: await bcrypt.hash(nova, 12) })
    .where(eq(usuarios.id, sessao.id));

  return { ok: true };
}

/* -------------------------------- Vagas --------------------------------- */

export async function salvarVaga(_estado: EstadoPainel, dados: FormData): Promise<EstadoPainel> {
  await exigirSessao();

  const id = textoDe(dados, "id");
  const cargo = textoDe(dados, "cargo");
  if (!cargo) return { erro: "Preencha ao menos o cargo." };

  const foto = await salvarImagemPublica(arquivoDe(dados, "foto") as File, "vaga-foto");
  const arte = await salvarImagemPublica(arquivoDe(dados, "arte") as File, "vaga-arte");
  const dataPublicacao = textoDe(dados, "publicadaEm");

  const valores = {
    cargo,
    cidades: serializaLista(listaDeTexto(textoDe(dados, "cidades"))),
    destaques: serializaLista(listaDeTexto(textoDe(dados, "destaques")).slice(0, 2)),
    telefone: textoDe(dados, "telefone") || MARCA.telefoneArte,
    descricao: textoDe(dados, "descricao"),
    fixada: marcadoEm(dados, "fixada"),
    status: textoDe(dados, "status") === "encerrada" ? "encerrada" : "ativa",
    atualizadaEm: new Date(),
    ...(dataPublicacao ? { publicadaEm: dataDeInput(dataPublicacao) } : {}),
  };

  if (id) {
    await db
      .update(vagas)
      .set({ ...valores, ...(foto ? { foto } : {}), ...(arte ? { arte } : {}) })
      .where(eq(vagas.id, id));
  } else {
    await db.insert(vagas).values({ id: randomUUID(), ...valores, foto, arte });
  }

  revalidarPublico("/empregos", "/canal");
  revalidatePath("/painel/vagas");
  redirect("/painel/vagas");
}

export async function alternarStatusVaga(dados: FormData) {
  await exigirSessao();
  const id = textoDe(dados, "id");
  const [vaga] = await db.select().from(vagas).where(eq(vagas.id, id)).limit(1);
  if (!vaga) return;

  await db
    .update(vagas)
    .set({ status: vaga.status === "ativa" ? "encerrada" : "ativa", atualizadaEm: new Date() })
    .where(eq(vagas.id, id));

  revalidarPublico("/empregos", `/vaga/${id}`);
  revalidatePath("/painel/vagas");
}

export async function alternarFixarVaga(dados: FormData) {
  await exigirSessao();
  const id = textoDe(dados, "id");
  const [vaga] = await db.select().from(vagas).where(eq(vagas.id, id)).limit(1);
  if (!vaga) return;

  await db
    .update(vagas)
    .set({ fixada: !vaga.fixada, atualizadaEm: new Date() })
    .where(eq(vagas.id, id));

  revalidarPublico("/empregos");
  revalidatePath("/painel/vagas");
}

export async function excluirVaga(dados: FormData) {
  await exigirSessao();
  const id = textoDe(dados, "id");
  await db.delete(vagas).where(eq(vagas.id, id));

  revalidarPublico("/empregos");
  revalidatePath("/painel/vagas");
}

/* ------------------------------- Artigos -------------------------------- */

export async function salvarArtigo(_estado: EstadoPainel, dados: FormData): Promise<EstadoPainel> {
  await exigirSessao();

  const id = textoDe(dados, "id");
  const titulo = textoDe(dados, "titulo");
  if (!titulo) return { erro: "Cole o post ou preencha o título." };

  const capa = await salvarImagemPublica(arquivoDe(dados, "capa") as File, "artigo-capa");
  const dataPublicacao = textoDe(dados, "publicadoEm");

  const valores = {
    icone: textoDe(dados, "icone") || "artigo",
    titulo,
    resumo: textoDe(dados, "resumo"),
    link: textoDe(dados, "link"),
    tags: serializaLista(
      textoDe(dados, "tags")
        .split(/\s+/)
        .filter(Boolean)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)),
    ),
    categoria: textoDe(dados, "categoria") || "Vendas",
    status: textoDe(dados, "status") === "rascunho" ? "rascunho" : "publicado",
    atualizadoEm: new Date(),
    ...(dataPublicacao ? { publicadoEm: dataDeInput(dataPublicacao) } : {}),
  };

  if (id) {
    await db
      .update(artigos)
      .set({ ...valores, ...(capa ? { capa } : {}) })
      .where(eq(artigos.id, id));
  } else {
    await db.insert(artigos).values({ id: randomUUID(), ...valores, capa });
  }

  revalidarPublico("/artigos");
  revalidatePath("/painel/artigos");
  redirect("/painel/artigos");
}

export async function alternarStatusArtigo(dados: FormData) {
  await exigirSessao();
  const id = textoDe(dados, "id");
  const [artigo] = await db.select().from(artigos).where(eq(artigos.id, id)).limit(1);
  if (!artigo) return;

  await db
    .update(artigos)
    .set({
      status: artigo.status === "rascunho" ? "publicado" : "rascunho",
      atualizadoEm: new Date(),
    })
    .where(eq(artigos.id, id));

  revalidarPublico("/artigos", `/artigo/${id}`);
  revalidatePath("/painel/artigos");
}

export async function excluirArtigo(dados: FormData) {
  await exigirSessao();
  const id = textoDe(dados, "id");
  await db.delete(artigos).where(eq(artigos.id, id));

  revalidarPublico("/artigos");
  revalidatePath("/painel/artigos");
}

/* ------------------------------ Currículos ------------------------------ */

export async function atualizarCurriculo(dados: FormData) {
  await exigirSessao();
  const id = textoDe(dados, "id");
  const status = textoDe(dados, "status");
  const obs = textoDe(dados, "obs");

  await db
    .update(curriculos)
    .set({
      ...(status ? { status } : {}),
      obs,
      atualizadoEm: new Date(),
    })
    .where(eq(curriculos.id, id));

  revalidatePath("/painel/curriculos");
}

export async function excluirCurriculo(dados: FormData) {
  await exigirSessao();
  const id = textoDe(dados, "id");

  const [registro] = await db.select().from(curriculos).where(eq(curriculos.id, id)).limit(1);
  if (registro) await apagarArquivo(registro.arquivoPath);

  await db.delete(curriculos).where(eq(curriculos.id, id));
  revalidatePath("/painel/curriculos");
  redirect("/painel/curriculos");
}

/* --------------------------- Pedidos de anúncio -------------------------- */

export async function atualizarPedido(dados: FormData) {
  await exigirSessao();
  const id = textoDe(dados, "id");
  const status = textoDe(dados, "status");
  const obs = textoDe(dados, "obs");

  await db
    .update(pedidosAnuncio)
    .set({ ...(status ? { status } : {}), obs, atualizadoEm: new Date() })
    .where(eq(pedidosAnuncio.id, id));

  revalidatePath("/painel/anuncios");
}

export async function excluirPedido(dados: FormData) {
  await exigirSessao();
  await db.delete(pedidosAnuncio).where(eq(pedidosAnuncio.id, textoDe(dados, "id")));
  revalidatePath("/painel/anuncios");
}

/* ----------------------------- Depoimentos ------------------------------ */

export async function salvarDepoimento(
  _estado: EstadoPainel,
  dados: FormData,
): Promise<EstadoPainel> {
  await exigirSessao();

  const nome = textoDe(dados, "nome");
  const texto = textoDe(dados, "texto");
  if (!nome || !texto) return { erro: "Preencha o nome e o depoimento." };

  const id = textoDe(dados, "id");
  const valores = {
    tipo: textoDe(dados, "tipo") || "Candidato recolocado",
    nome,
    cargo: textoDe(dados, "cargo"),
    texto,
    ordem: Number(textoDe(dados, "ordem")) || 0,
  };

  if (id) await db.update(depoimentos).set(valores).where(eq(depoimentos.id, id));
  else await db.insert(depoimentos).values({ id: randomUUID(), ...valores });

  revalidarPublico("/depoimentos");
  revalidatePath("/painel/depoimentos");
  return { ok: true };
}

export async function excluirDepoimento(dados: FormData) {
  await exigirSessao();
  await db.delete(depoimentos).where(eq(depoimentos.id, textoDe(dados, "id")));
  revalidarPublico("/depoimentos");
  revalidatePath("/painel/depoimentos");
}

/* ------------------------------ Marketplace ----------------------------- */

export async function salvarParceiro(
  _estado: EstadoPainel,
  dados: FormData,
): Promise<EstadoPainel> {
  await exigirSessao();

  const titulo = textoDe(dados, "titulo");
  if (!titulo) return { erro: "Preencha o nome do parceiro." };

  const id = textoDe(dados, "id");
  const valores = {
    titulo,
    tipo: textoDe(dados, "tipo"),
    descricao: textoDe(dados, "descricao"),
    link: textoDe(dados, "link"),
    cta: textoDe(dados, "cta") || "Saiba mais",
    ordem: Number(textoDe(dados, "ordem")) || 0,
  };

  if (id) await db.update(parceiros).set(valores).where(eq(parceiros.id, id));
  else await db.insert(parceiros).values({ id: randomUUID(), ...valores });

  revalidarPublico("/marketplace");
  revalidatePath("/painel/marketplace");
  return { ok: true };
}

export async function excluirParceiro(dados: FormData) {
  await exigirSessao();
  await db.delete(parceiros).where(eq(parceiros.id, textoDe(dados, "id")));
  revalidarPublico("/marketplace");
  revalidatePath("/painel/marketplace");
}

/* ------------------------------- Contatos ------------------------------- */

export async function marcarMensagemLida(dados: FormData) {
  await exigirSessao();
  const id = textoDe(dados, "id");
  const [registro] = await db.select().from(mensagens).where(eq(mensagens.id, id)).limit(1);
  if (!registro) return;

  await db.update(mensagens).set({ lida: !registro.lida }).where(eq(mensagens.id, id));
  revalidatePath("/painel/contatos");
}

export async function excluirMensagem(dados: FormData) {
  await exigirSessao();
  await db.delete(mensagens).where(eq(mensagens.id, textoDe(dados, "id")));
  revalidatePath("/painel/contatos");
}
