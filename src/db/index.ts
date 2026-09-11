import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

/**
 * Conexão com o banco.
 *
 * DATABASE_URL aceita:
 *   file:./dev.db            → arquivo local (padrão de desenvolvimento)
 *   libsql://...turso.io     → banco remoto Turso (produção serverless)
 *
 * Em Turso também é preciso definir DATABASE_AUTH_TOKEN.
 *
 * O cliente é guardado em globalThis para o hot reload do Next não abrir uma
 * conexão nova a cada alteração de arquivo em desenvolvimento.
 */
const url = process.env.DATABASE_URL ?? "file:./dev.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

const globalParaDb = globalThis as unknown as {
  __sharkDb?: ReturnType<typeof drizzle<typeof schema>>;
};

export const db =
  globalParaDb.__sharkDb ?? drizzle(createClient({ url, authToken }), { schema });

if (process.env.NODE_ENV !== "production") globalParaDb.__sharkDb = db;

export { schema };
