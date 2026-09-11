/**
 * Banco da Shark Trainers (Drizzle ORM + SQLite/libSQL).
 *
 * Listas (cidades, destaques, tags) ficam gravadas como texto JSON. Assim o
 * mesmo schema roda em SQLite local, em Turso e, com pouca mudança, em Postgres.
 * Use os helpers `parseLista` / `serializaLista` de src/lib/listas.ts para ler
 * e gravar esses campos — nunca faça JSON.parse solto pelo código.
 */
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const agora = sql`(unixepoch())`;

/** Quem entra no painel interno. */
export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey(),
  usuario: text("usuario").notNull().unique(),
  nome: text("nome").notNull(),
  senhaHash: text("senha_hash").notNull(),
  criadoEm: integer("criado_em", { mode: "timestamp" }).notNull().default(agora),
});

/** Vaga do Canal de Empregos. */
export const vagas = sqliteTable(
  "vagas",
  {
    id: text("id").primaryKey(),
    cargo: text("cargo").notNull(),
    /** JSON: ["Tubarão SC","Gravataí RS"] */
    cidades: text("cidades").notNull().default("[]"),
    /** JSON: ["Loja rua projeção 200k","Ganhos acima da média"] */
    destaques: text("destaques").notNull().default("[]"),
    telefone: text("telefone").notNull().default("(011) 97839.8648"),
    descricao: text("descricao").notNull().default(""),
    /** "ativa" ou "encerrada" */
    status: text("status").notNull().default("ativa"),
    /** Vaga fixada aparece primeiro no feed. */
    fixada: integer("fixada", { mode: "boolean" }).notNull().default(false),
    /** Arte pronta 1080x1600 (caminho em /assets ou /uploads). */
    arte: text("arte"),
    /** Foto de fundo usada pelo gerador de arte. */
    foto: text("foto"),
    publicadaEm: integer("publicada_em", { mode: "timestamp" }).notNull().default(agora),
    criadaEm: integer("criada_em", { mode: "timestamp" }).notNull().default(agora),
    atualizadaEm: integer("atualizada_em", { mode: "timestamp" }).notNull().default(agora),
  },
  (t) => [index("vagas_status_idx").on(t.status, t.publicadaEm)],
);

/** Artigo do mural (coluna Mapeamento de Vendas). */
export const artigos = sqliteTable(
  "artigos",
  {
    id: text("id").primaryKey(),
    /** Nome do ícone em /assets/icons: artigo, chuva, bussola, rota, parceria, alvo, oculos, grafico. */
    icone: text("icone").notNull().default("artigo"),
    titulo: text("titulo").notNull(),
    resumo: text("resumo").notNull().default(""),
    link: text("link").notNull().default(""),
    /** JSON: ["#vendas","#varejooptico"] */
    tags: text("tags").notNull().default("[]"),
    categoria: text("categoria").notNull().default("Vendas"),
    capa: text("capa"),
    /** "publicado" ou "rascunho" */
    status: text("status").notNull().default("publicado"),
    publicadoEm: integer("publicado_em", { mode: "timestamp" }).notNull().default(agora),
    criadoEm: integer("criado_em", { mode: "timestamp" }).notNull().default(agora),
    atualizadoEm: integer("atualizado_em", { mode: "timestamp" }).notNull().default(agora),
  },
  (t) => [index("artigos_status_idx").on(t.status, t.publicadoEm)],
);

/** Depoimento exibido na Home e na página de Depoimentos. */
export const depoimentos = sqliteTable(
  "depoimentos",
  {
    id: text("id").primaryKey(),
    tipo: text("tipo").notNull().default("Candidato recolocado"),
    nome: text("nome").notNull(),
    cargo: text("cargo").notNull().default(""),
    texto: text("texto").notNull(),
    ordem: integer("ordem").notNull().default(0),
    criadoEm: integer("criado_em", { mode: "timestamp" }).notNull().default(agora),
  },
  (t) => [index("depoimentos_ordem_idx").on(t.ordem)],
);

/** Empresa parceira do Marketplace. */
export const parceiros = sqliteTable(
  "parceiros",
  {
    id: text("id").primaryKey(),
    titulo: text("titulo").notNull(),
    tipo: text("tipo").notNull().default(""),
    descricao: text("descricao").notNull().default(""),
    link: text("link").notNull().default(""),
    cta: text("cta").notNull().default("Saiba mais"),
    ordem: integer("ordem").notNull().default(0),
    criadoEm: integer("criado_em", { mode: "timestamp" }).notNull().default(agora),
  },
  (t) => [index("parceiros_ordem_idx").on(t.ordem)],
);

/**
 * Currículo enviado pelo formulário público.
 * Contém dados pessoais: o arquivo fica fora da pasta pública e só é servido
 * para quem está logado no painel.
 */
export const curriculos = sqliteTable(
  "curriculos",
  {
    id: text("id").primaryKey(),
    nome: text("nome").notNull(),
    email: text("email").notNull(),
    telefone: text("telefone").notNull(),
    cidade: text("cidade").notNull(),
    cargo: text("cargo").notNull(),
    anos: text("anos").notNull(),
    salario: text("salario").notNull().default(""),
    linkedin: text("linkedin").notNull().default(""),
    mensagem: text("mensagem").notNull().default(""),
    arquivoNome: text("arquivo_nome").notNull(),
    /** Nome do arquivo dentro de UPLOADS_DIR. */
    arquivoPath: text("arquivo_path").notNull(),
    arquivoTipo: text("arquivo_tipo").notNull().default("application/octet-stream"),
    /** "novo", "em análise", "contatado" ou "arquivado" */
    status: text("status").notNull().default("novo"),
    obs: text("obs").notNull().default(""),
    vagaId: text("vaga_id").references(() => vagas.id, { onDelete: "set null" }),
    criadoEm: integer("criado_em", { mode: "timestamp" }).notNull().default(agora),
    atualizadoEm: integer("atualizado_em", { mode: "timestamp" }).notNull().default(agora),
  },
  (t) => [index("curriculos_status_idx").on(t.status, t.criadoEm)],
);

/** Pedido enviado pelo formulário "Anuncie Aqui". */
export const pedidosAnuncio = sqliteTable(
  "pedidos_anuncio",
  {
    id: text("id").primaryKey(),
    empresa: text("empresa").notNull(),
    responsavel: text("responsavel").notNull(),
    whatsapp: text("whatsapp").notNull(),
    email: text("email").notNull().default(""),
    cidade: text("cidade").notNull(),
    cargo: text("cargo").notNull(),
    descricao: text("descricao").notNull().default(""),
    /** "pendente", "em contato", "publicado" ou "recusado" */
    status: text("status").notNull().default("pendente"),
    obs: text("obs").notNull().default(""),
    criadoEm: integer("criado_em", { mode: "timestamp" }).notNull().default(agora),
    atualizadoEm: integer("atualizado_em", { mode: "timestamp" }).notNull().default(agora),
  },
  (t) => [index("pedidos_status_idx").on(t.status, t.criadoEm)],
);

/** Mensagem enviada pelo formulário de Contato. */
export const mensagens = sqliteTable(
  "mensagens",
  {
    id: text("id").primaryKey(),
    nome: text("nome").notNull(),
    contato: text("contato").notNull(),
    mensagem: text("mensagem").notNull(),
    lida: integer("lida", { mode: "boolean" }).notNull().default(false),
    criadoEm: integer("criado_em", { mode: "timestamp" }).notNull().default(agora),
  },
  (t) => [index("mensagens_criado_idx").on(t.criadoEm)],
);

export type Vaga = typeof vagas.$inferSelect;
export type Artigo = typeof artigos.$inferSelect;
export type Depoimento = typeof depoimentos.$inferSelect;
export type Parceiro = typeof parceiros.$inferSelect;
export type Curriculo = typeof curriculos.$inferSelect;
export type PedidoAnuncio = typeof pedidosAnuncio.$inferSelect;
export type Mensagem = typeof mensagens.$inferSelect;
export type Usuario = typeof usuarios.$inferSelect;
