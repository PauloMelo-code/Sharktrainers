"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { EstadoFormulario } from "@/actions/estado";
import { db } from "@/db";
import { curriculos, mensagens, pedidosAnuncio } from "@/db/schema";

const OBRIGATORIO = "Campo obrigatório";
const FALHA_ENVIO =
  "Não conseguimos registrar seu envio agora. Tente de novo em instantes ou fale com a gente no WhatsApp.";

function texto(nome: string, min = 1) {
  return z.string().trim().min(min, OBRIGATORIO).max(500, "Texto muito longo").describe(nome);
}

function valoresDoForm(dados: FormData): Record<string, string> {
  const valores: Record<string, string> = {};
  for (const [chave, valor] of dados.entries()) {
    if (typeof valor === "string") valores[chave] = valor;
  }
  return valores;
}

function errosDoZod(erro: z.ZodError): Record<string, string> {
  const erros: Record<string, string> = {};
  for (const problema of erro.issues) {
    const campo = String(problema.path[0] ?? "");
    if (campo && !erros[campo]) erros[campo] = problema.message;
  }
  return erros;
}

/* ------------------------------ Currículo ------------------------------- */

const esquemaCurriculo = z.object({
  nome: texto("nome", 3),
  email: z.string().trim().min(1, OBRIGATORIO).email("E-mail inválido"),
  telefone: texto("telefone", 8),
  cidade: texto("cidade", 2),
  cargo: texto("cargo"),
  anos: texto("anos"),
  salario: z.string().trim().max(100).optional().default(""),
  linkedin: z.string().trim().max(200).optional().default(""),
  mensagem: z.string().trim().max(2000).optional().default(""),
  vagaId: z.string().trim().max(100).optional().default(""),
  lgpd: z.literal("on", { message: "É preciso aceitar para enviar" }),
});

export async function enviarCurriculo(
  _estado: EstadoFormulario,
  dados: FormData,
): Promise<EstadoFormulario> {
  const valores = valoresDoForm(dados);
  const resultado = esquemaCurriculo.safeParse(Object.fromEntries(dados.entries()));

  if (!resultado.success) {
    return { ok: false, erros: errosDoZod(resultado.error), valores };
  }

  const dadosValidos = resultado.data;

  try {
    // O formulário não pede mais o arquivo do currículo: o candidato preenche
    // a ficha e a conversa segue pelo WhatsApp. As colunas de arquivo
    // continuam no banco, sem preenchimento, porque os currículos enviados
    // antes desta mudança seguem disponíveis para download no painel.
    await db.insert(curriculos).values({
      id: randomUUID(),
      nome: dadosValidos.nome,
      email: dadosValidos.email,
      telefone: dadosValidos.telefone,
      cidade: dadosValidos.cidade,
      cargo: dadosValidos.cargo,
      anos: dadosValidos.anos,
      salario: dadosValidos.salario ?? "",
      linkedin: dadosValidos.linkedin ?? "",
      mensagem: dadosValidos.mensagem ?? "",
      vagaId: dadosValidos.vagaId || null,
    });
  } catch (erro) {
    console.error("Falha ao gravar currículo", erro);
    return { ok: false, erros: { geral: FALHA_ENVIO }, valores };
  }

  revalidatePath("/painel/curriculos");

  return {
    ok: true,
    erros: {},
    valores: {},
    resumo: {
      nome: dadosValidos.nome,
      cargo: dadosValidos.cargo,
      cidade: dadosValidos.cidade,
    },
  };
}

/* --------------------------- Pedido de anúncio --------------------------- */

const esquemaAnuncio = z.object({
  empresa: texto("empresa", 2),
  responsavel: texto("responsavel", 2),
  whatsapp: texto("whatsapp", 8),
  email: z.union([z.literal(""), z.string().trim().email("E-mail inválido")]).optional(),
  cidade: texto("cidade", 2),
  cargo: texto("cargo"),
  descricao: z.string().trim().max(2000).optional().default(""),
  lgpd: z.literal("on", { message: "É preciso aceitar para enviar" }),
});

export async function enviarPedidoAnuncio(
  _estado: EstadoFormulario,
  dados: FormData,
): Promise<EstadoFormulario> {
  const valores = valoresDoForm(dados);
  const resultado = esquemaAnuncio.safeParse(Object.fromEntries(dados.entries()));

  if (!resultado.success) {
    return { ok: false, erros: errosDoZod(resultado.error), valores };
  }

  const dadosValidos = resultado.data;

  try {
    await db.insert(pedidosAnuncio).values({
      id: randomUUID(),
      empresa: dadosValidos.empresa,
      responsavel: dadosValidos.responsavel,
      whatsapp: dadosValidos.whatsapp,
      email: dadosValidos.email ?? "",
      cidade: dadosValidos.cidade,
      cargo: dadosValidos.cargo,
      descricao: dadosValidos.descricao ?? "",
    });
  } catch (erro) {
    console.error("Falha ao gravar pedido de anúncio", erro);
    return { ok: false, erros: { geral: FALHA_ENVIO }, valores };
  }

  revalidatePath("/painel/anuncios");

  return {
    ok: true,
    erros: {},
    valores: {},
    resumo: { responsavel: dadosValidos.responsavel, whatsapp: dadosValidos.whatsapp },
  };
}

/* ------------------------------- Contato -------------------------------- */

const esquemaContato = z.object({
  nome: texto("nome", 2),
  contato: texto("contato", 5),
  mensagem: z.string().trim().min(5, OBRIGATORIO).max(2000, "Mensagem muito longa"),
});

export async function enviarContato(
  _estado: EstadoFormulario,
  dados: FormData,
): Promise<EstadoFormulario> {
  const valores = valoresDoForm(dados);
  const resultado = esquemaContato.safeParse(Object.fromEntries(dados.entries()));

  if (!resultado.success) {
    return { ok: false, erros: errosDoZod(resultado.error), valores };
  }

  try {
    await db.insert(mensagens).values({ id: randomUUID(), ...resultado.data });
  } catch (erro) {
    console.error("Falha ao gravar mensagem de contato", erro);
    return { ok: false, erros: { geral: FALHA_ENVIO }, valores };
  }

  revalidatePath("/painel/contatos");

  return { ok: true, erros: {}, valores: {}, resumo: { nome: resultado.data.nome } };
}
