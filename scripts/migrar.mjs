/**
 * Aplica as migrações da pasta drizzle/ no banco apontado por DATABASE_URL.
 *
 * Roda só com as dependências de produção (node + drizzle-orm + postgres),
 * sem drizzle-kit nem tsx. É o comando para rodar a cada deploy: aplica só o
 * que falta e não mexe em nada que já existe.
 *
 *   node scripts/migrar.mjs
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL não definida.");
  process.exit(1);
}

// max: 1 porque o migrador precisa de uma conexão só, em sequência.
const cliente = postgres(url, { max: 1 });

try {
  await migrate(drizzle(cliente), { migrationsFolder: "./drizzle" });
  console.log("Migrações aplicadas.");
} catch (erro) {
  console.error("Falha ao migrar:", erro);
  process.exit(1);
} finally {
  await cliente.end();
}
