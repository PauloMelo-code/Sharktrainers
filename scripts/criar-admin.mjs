/**
 * Cria (ou atualiza a senha do) usuário do painel a partir das variáveis
 * ADMIN_USER e ADMIN_PASSWORD.
 *
 * Roda só com as dependências de produção, sem tsx. Use depois de migrar,
 * num servidor novo, ou quando precisar redefinir a senha por fora do painel.
 *
 *   node scripts/criar-admin.mjs
 */
import { randomUUID } from "node:crypto";

import bcrypt from "bcryptjs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
const usuario = (process.env.ADMIN_USER ?? "vanessa").toLowerCase();
const senha = process.env.ADMIN_PASSWORD;

if (!url) {
  console.error("DATABASE_URL não definida.");
  process.exit(1);
}

if (!senha || senha.length < 8) {
  console.error(
    "Defina ADMIN_PASSWORD com pelo menos 8 caracteres antes de rodar este comando.",
  );
  process.exit(1);
}

const sql = postgres(url, { max: 1, onnotice: () => {} });

try {
  const senhaHash = await bcrypt.hash(senha, 12);
  const existente = await sql`select id from usuarios where usuario = ${usuario}`;

  if (existente.length > 0) {
    await sql`update usuarios set senha_hash = ${senhaHash} where usuario = ${usuario}`;
    console.log(`Senha do usuário "${usuario}" atualizada.`);
  } else {
    await sql`
      insert into usuarios (id, usuario, nome, senha_hash)
      values (${randomUUID()}, ${usuario}, ${"Vanessa D'Amato"}, ${senhaHash})
    `;
    console.log(`Usuário "${usuario}" criado.`);
  }
} catch (erro) {
  console.error("Falha ao criar o usuário do painel:", erro);
  process.exit(1);
} finally {
  await sql.end();
}
