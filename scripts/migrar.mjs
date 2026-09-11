/**
 * Aplica as migrações da pasta drizzle/ no banco apontado por DATABASE_URL.
 *
 * Roda só com as dependências de produção (node + drizzle-orm + @libsql/client),
 * sem drizzle-kit nem tsx. É o comando para rodar a cada deploy: aplica só o
 * que falta e não mexe em nada que já existe.
 *
 *   node scripts/migrar.mjs
 */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

const cliente = createClient({ url, authToken });
const db = drizzle(cliente);

try {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log(`Migrações aplicadas em ${url.replace(/\?.*$/, "")}`);
} catch (erro) {
  console.error("Falha ao migrar:", erro);
  process.exit(1);
} finally {
  cliente.close();
}
