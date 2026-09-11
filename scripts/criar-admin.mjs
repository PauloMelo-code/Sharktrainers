/**
 * Cria (ou atualiza a senha do) usuário do painel a partir das variáveis
 * ADMIN_USER e ADMIN_PASSWORD.
 *
 * Roda só com as dependências de produção, sem tsx. Use depois de migrar,
 * num servidor novo, ou quando precisar redefinir a senha por fora do painel.
 *
 *   node scripts/criar-admin.mjs
 */
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;
const usuario = (process.env.ADMIN_USER ?? "vanessa").toLowerCase();
const senha = process.env.ADMIN_PASSWORD;

if (!senha || senha.length < 8) {
  console.error(
    "Defina ADMIN_PASSWORD com pelo menos 8 caracteres antes de rodar este comando.",
  );
  process.exit(1);
}

const cliente = createClient({ url, authToken });

try {
  const senhaHash = await bcrypt.hash(senha, 12);
  const existente = await cliente.execute({
    sql: "select id from usuarios where usuario = ?",
    args: [usuario],
  });

  if (existente.rows.length > 0) {
    await cliente.execute({
      sql: "update usuarios set senha_hash = ? where usuario = ?",
      args: [senhaHash, usuario],
    });
    console.log(`Senha do usuário "${usuario}" atualizada.`);
  } else {
    await cliente.execute({
      sql: "insert into usuarios (id, usuario, nome, senha_hash, criado_em) values (?, ?, ?, ?, unixepoch())",
      args: [randomUUID(), usuario, "Vanessa D'Amato", senhaHash],
    });
    console.log(`Usuário "${usuario}" criado.`);
  }
} catch (erro) {
  console.error("Falha ao criar o usuário do painel:", erro);
  process.exit(1);
} finally {
  cliente.close();
}
