import { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { RepositorioMensajeSql } from "./adaptadores/repositorio-mensaje-sql";
import { RepositorioNumeroConectadoSql } from "./adaptadores/repositorio-numero-conectado-sql";
import { SistemaMensajes } from "./dominio/sistema-mensajes";
import { crearServidorIngesta } from "./entrada/servidor-ingesta";

export interface SecretosMeta {
  tokenVerificacion: string;
  secretoApp: string;
}

// Arma a mano el servicio de ingesta: repositorios, casos de uso y servidor. Lo usan programa-ingesta.ts y las
// pruebas de aceptación, para que ambos levanten exactamente lo mismo.
export function armarIngesta(pool: Pool, secretos: SecretosMeta): FastifyInstance {
  const sistemaMensajes = new SistemaMensajes(new RepositorioMensajeSql(pool), new RepositorioNumeroConectadoSql(pool));
  return crearServidorIngesta({ ...secretos, sistemaMensajes });
}
