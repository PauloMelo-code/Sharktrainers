import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
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
 * A conexão é criada na PRIMEIRA consulta, nunca na importação do módulo.
 * Isso importa no build: o `next build` carrega todos os módulos para montar
 * as páginas e roda sem variáveis de ambiente (o .env não entra na imagem
 * Docker). Se a conexão fosse criada aqui em cima, o build quebraria.
 */
type Banco = PostgresJsDatabase<typeof schema>;

const globalParaDb = globalThis as unknown as {
  __sharkSql?: ReturnType<typeof postgres>;
  __sharkDb?: Banco;
};

function conectar(): Banco {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL não definida. Configure a variável de ambiente com a URL do PostgreSQL.",
    );
  }

  const cliente =
    globalParaDb.__sharkSql ??
    postgres(url, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

  const banco = drizzle(cliente, { schema });

  // Em desenvolvimento, o hot reload recarrega este módulo a cada alteração:
  // guardar em globalThis evita abrir um pool novo toda vez.
  if (process.env.NODE_ENV !== "production") {
    globalParaDb.__sharkSql = cliente;
    globalParaDb.__sharkDb = banco;
  }

  return banco;
}

let instancia: Banco | null = null;

function banco(): Banco {
  instancia ??= globalParaDb.__sharkDb ?? conectar();
  return instancia;
}

/**
 * Use como se fosse o cliente do Drizzle: `db.select()`, `db.insert()`…
 * A conexão real só acontece quando um desses métodos é chamado.
 */
export const db = new Proxy({} as Banco, {
  get(_alvo, propriedade) {
    const real = banco();
    const valor = Reflect.get(real, propriedade, real);
    return typeof valor === "function" ? valor.bind(real) : valor;
  },
});

export { schema };
