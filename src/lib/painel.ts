/** Consultas usadas apenas pelo painel interno. */
import { count, desc, eq, gte } from "drizzle-orm";

import { db } from "@/db";
import {
  artigos,
  curriculos,
  mensagens,
  pedidosAnuncio,
  vagas,
  type Curriculo,
} from "@/db/schema";
import { formatarData, iniciais } from "@/lib/formato";

export function decorarCurriculo(registro: Curriculo) {
  return {
    ...registro,
    dataLabel: formatarData(registro.criadoEm),
    iniciais: iniciais(registro.nome),
    classeStatus: `etiqueta-${registro.status.replace(/\s+/g, "-").replace("á", "a")}`,
  };
}

export async function indicadores() {
  const umaSemanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [[ativas], [novosCurriculos], [curriculosSemana], [pedidosPendentes], [totalArtigos]] =
    await Promise.all([
      db.select({ total: count() }).from(vagas).where(eq(vagas.status, "ativa")),
      db.select({ total: count() }).from(curriculos).where(eq(curriculos.status, "novo")),
      db.select({ total: count() }).from(curriculos).where(gte(curriculos.criadoEm, umaSemanaAtras)),
      db
        .select({ total: count() })
        .from(pedidosAnuncio)
        .where(eq(pedidosAnuncio.status, "pendente")),
      db.select({ total: count() }).from(artigos),
    ]);

  return {
    vagasAtivas: ativas?.total ?? 0,
    curriculosNovos: novosCurriculos?.total ?? 0,
    curriculosSemana: curriculosSemana?.total ?? 0,
    pedidosPendentes: pedidosPendentes?.total ?? 0,
    artigos: totalArtigos?.total ?? 0,
  };
}

export async function ultimosCurriculos(limite = 4) {
  const registros = await db
    .select()
    .from(curriculos)
    .orderBy(desc(curriculos.criadoEm))
    .limit(limite);
  return registros.map(decorarCurriculo);
}

export async function pedidosPendentes(limite = 3) {
  const registros = await db
    .select()
    .from(pedidosAnuncio)
    .where(eq(pedidosAnuncio.status, "pendente"))
    .orderBy(desc(pedidosAnuncio.criadoEm))
    .limit(limite);
  return registros.map((registro) => ({
    ...registro,
    dataLabel: formatarData(registro.criadoEm),
  }));
}

export async function ultimosArtigos(limite = 3) {
  const registros = await db.select().from(artigos).orderBy(desc(artigos.publicadoEm)).limit(limite);
  return registros.map((registro) => ({
    ...registro,
    dataLabel: formatarData(registro.publicadoEm),
  }));
}

export async function listarCurriculos() {
  const registros = await db.select().from(curriculos).orderBy(desc(curriculos.criadoEm));
  return registros.map(decorarCurriculo);
}

export async function listarPedidos() {
  const registros = await db.select().from(pedidosAnuncio).orderBy(desc(pedidosAnuncio.criadoEm));
  return registros.map((registro) => ({
    ...registro,
    dataLabel: formatarData(registro.criadoEm),
  }));
}

export async function listarMensagens() {
  const registros = await db.select().from(mensagens).orderBy(desc(mensagens.criadoEm));
  return registros.map((registro) => ({
    ...registro,
    dataLabel: formatarData(registro.criadoEm),
  }));
}

/** Cargos e cidades já cadastrados, para os filtros do painel. */
export async function vagasParaVinculo() {
  return db.select({ id: vagas.id, cargo: vagas.cargo, cidades: vagas.cidades }).from(vagas);
}
