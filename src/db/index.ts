import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/**
 * Conexão com o PostgreSQL.
 *
 * DATABASE_URL no formato:
 *   postgres://usuario:senha@host:5432/banco?sslmode=disable
 *
 * Dentro do Easypanel o host é o nome do serviço de banco (rede interna, sem
 * SSL). Em banco gerenciado na internet, troque para sslmode=require.
 *
 * A conexão fica guardada em globalThis para o hot reload do Next não abrir um
 * pool novo a cada alteração de arquivo em desenvolvimento.
 */
const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL não definida. Copie o .env.example para .env e preencha a URL do PostgreSQL.",
  );
}

const globalParaDb = globalThis as unknown as {
  __sharkSql?: ReturnType<typeof postgres>;
  __sharkDb?: ReturnType<typeof drizzle<typeof schema>>;
};

const cliente =
  globalParaDb.__sharkSql ??
  postgres(url, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

export const db = globalParaDb.__sharkDb ?? drizzle(cliente, { schema });

if (process.env.NODE_ENV !== "production") {
  globalParaDb.__sharkSql = cliente;
  globalParaDb.__sharkDb = db;
}

export { schema };
