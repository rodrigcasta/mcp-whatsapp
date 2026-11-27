import { Pool } from "pg";

export function crearPool(entorno: NodeJS.ProcessEnv = process.env): Pool {
  return new Pool({
    host: entorno.POSTGRES_HOST ?? "localhost",
    port: Number(entorno.POSTGRES_PORT ?? 5433),
    user: entorno.POSTGRES_USER ?? "postgres",
    password: entorno.POSTGRES_PASSWORD ?? "example",
    database: entorno.POSTGRES_DB ?? "postgres",
    idleTimeoutMillis: 30_000,
  });
}
