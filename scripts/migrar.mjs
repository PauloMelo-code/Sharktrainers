/**
 * Aplica as migrações da pasta drizzle/ no banco apontado por DATABASE_URL e
 * garante que existe um usuário para entrar no painel.
 *
 * Roda antes do servidor subir (veja o script "start" do package.json), então
 * um deploy novo já nasce com as tabelas criadas. Rodar de novo é inofensivo:
 * aplica só o que falta e não mexe em nada que já existe.
 *
 *   node scripts/migrar.mjs
 *
 * Só usa dependências de produção: sem drizzle-kit e sem tsx.
 */
import { randomUUID } from "node:crypto";

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

/**
 * Cria o usuário do painel apenas quando ainda não existe nenhum, para o site
 * novo já nascer com acesso. Nunca troca a senha de um usuário existente:
 * para isso existe o `npm run db:admin`.
 */
async function garantirUsuario(cliente) {
  const [{ total }] = await cliente`select count(*)::int as total from usuarios`;
  if (total > 0) return;

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

// max: 1 porque o migrador precisa de uma conexão só, em sequência.
const cliente = postgres(url, { max: 1 });

try {
  await esperarBanco(cliente);
  await migrate(drizzle(cliente), { migrationsFolder: "./drizzle" });
  console.log("Migrações aplicadas.");
  await garantirUsuario(cliente);
} catch (erro) {
  console.error("Falha ao migrar:", erro);
  process.exit(1);
} finally {
  await cliente.end();
}
