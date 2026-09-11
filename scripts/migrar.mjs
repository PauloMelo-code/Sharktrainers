/**
 * Roda antes do servidor subir (veja o script "start" do package.json) e deixa
 * o banco pronto:
 *
 *   1. aplica as migrações pendentes da pasta drizzle/;
 *   2. cria o usuário do painel, se ainda não houver nenhum;
 *   3. carrega o conteúdo inicial, se o site estiver completamente vazio.
 *
 * Nada aqui apaga dados: cada etapa só age quando não encontra nada no lugar.
 * Rodar de novo é inofensivo.
 *
 *   node scripts/migrar.mjs
 *
 * Só usa dependências de produção: sem drizzle-kit e sem tsx.
 */
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL não definida.");
  process.exit(1);
}

const TENTATIVAS = 10;
const ESPERA_MS = 3000;

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Num deploy, o site costuma subir antes do banco terminar de iniciar.
 * Em vez de quebrar, espera e tenta de novo.
 */
async function esperarBanco(cliente) {
  for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa += 1) {
    try {
      await cliente`select 1`;
      return;
    } catch (erro) {
      if (tentativa === TENTATIVAS) throw erro;
      console.log(
        `Banco ainda não respondeu (tentativa ${tentativa}/${TENTATIVAS}). Nova tentativa em ${ESPERA_MS / 1000}s…`,
      );
      await dormir(ESPERA_MS);
    }
  }
}

const contar = async (cliente, tabela) => {
  const [{ total }] = await cliente`select count(*)::int as total from ${cliente(tabela)}`;
  return total;
};

/**
 * Cria o usuário do painel apenas quando ainda não existe nenhum, para o site
 * novo já nascer com acesso. Nunca troca a senha de um usuário existente:
 * para isso existe o `npm run db:admin`.
 */
async function garantirUsuario(cliente) {
  if ((await contar(cliente, "usuarios")) > 0) return;

  const usuario = (process.env.ADMIN_USER ?? "vanessa").toLowerCase();
  const senha = process.env.ADMIN_PASSWORD;

  if (!senha || senha.length < 8) {
    console.warn(
      "Nenhum usuário no painel e ADMIN_PASSWORD ausente ou curta demais (mínimo 8 caracteres).\n" +
        "Defina a variável e rode: npm run db:admin",
    );
    return;
  }

  await cliente`
    insert into usuarios (id, usuario, nome, senha_hash)
    values (${randomUUID()}, ${usuario}, ${"Vanessa D'Amato"}, ${await bcrypt.hash(senha, 12)})
  `;
  console.log(`Usuário "${usuario}" criado para o painel.`);
}

/**
 * Carga inicial: as vagas, os artigos e os parceiros já aprovados.
 *
 * Só entra quando as três tabelas estão vazias ao mesmo tempo, ou seja, num
 * banco recém-criado. Depois disso o conteúdo é responsabilidade do painel, e
 * este passo nunca mais mexe em nada — nem se a Vanessa apagar uma vaga.
 */
async function carregarConteudoInicial(cliente) {
  const [vagas, artigos, parceiros] = await Promise.all([
    contar(cliente, "vagas"),
    contar(cliente, "artigos"),
    contar(cliente, "parceiros"),
  ]);

  if (vagas > 0 || artigos > 0 || parceiros > 0) return;

  const conteudo = JSON.parse(
    await readFile(new URL("./conteudo-inicial.json", import.meta.url), "utf8"),
  );

  for (const v of conteudo.vagas) {
    await cliente`
      insert into vagas (id, cargo, cidades, destaques, telefone, descricao, status, fixada, arte, foto, publicada_em)
      values (${v.id}, ${v.cargo}, ${v.cidades}, ${v.destaques}, ${v.telefone}, ${v.descricao},
              ${v.status}, ${v.fixada}, ${v.arte}, ${v.foto}, ${v.publicada_em}::timestamptz)
    `;
  }

  for (const a of conteudo.artigos) {
    await cliente`
      insert into artigos (id, icone, titulo, resumo, link, tags, categoria, capa, status, publicado_em)
      values (${a.id}, ${a.icone}, ${a.titulo}, ${a.resumo}, ${a.link}, ${a.tags},
              ${a.categoria}, ${a.capa}, ${a.status}, ${a.publicado_em}::timestamptz)
    `;
  }

  for (const p of conteudo.parceiros) {
    await cliente`
      insert into parceiros (id, titulo, tipo, descricao, link, cta, ordem)
      values (${p.id}, ${p.titulo}, ${p.tipo}, ${p.descricao}, ${p.link}, ${p.cta}, ${p.ordem})
    `;
  }

  console.log(
    `Conteúdo inicial carregado: ${conteudo.vagas.length} vagas, ${conteudo.artigos.length} artigos e ${conteudo.parceiros.length} parceiros.`,
  );
}

// max: 1 porque o migrador precisa de uma conexão só, em sequência.
// onnotice silencia avisos como "schema drizzle already exists, skipping",
// normais a partir do segundo deploy: sem eles o log mostra só o que importa.
const cliente = postgres(url, { max: 1, onnotice: () => {} });

try {
  await esperarBanco(cliente);
  await migrate(drizzle(cliente), { migrationsFolder: "./drizzle" });
  console.log("Migrações aplicadas.");
  await garantirUsuario(cliente);
  await carregarConteudoInicial(cliente);
} catch (erro) {
  console.error("Falha ao preparar o banco:", erro);
  process.exit(1);
} finally {
  await cliente.end();
}
