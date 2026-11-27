import { Pool } from "pg";
import { crearPool } from "../../app/adaptadores/crear-pool";
import { armarIngesta } from "../../app/armado-ingesta";
import { MundoDeLaAplicacion } from "./mundo";

export const TOKEN_VERIFICACION = "token-de-prueba";
export const SECRETO_APP = "secreto-de-prueba";

// Las pruebas de aceptación usan test_db (puerto 5434), igual que las de adaptadores.
export function crearPoolDeAceptacion(): Pool {
  return crearPool({ ...process.env, POSTGRES_PORT: process.env.POSTGRES_PORT ?? "5434" });
}

export async function levantarIngesta(mundo: MundoDeLaAplicacion): Promise<void> {
  mundo.servidorIngesta = armarIngesta(mundo.pool, { tokenVerificacion: TOKEN_VERIFICACION, secretoApp: SECRETO_APP });
  mundo.urlIngesta = await mundo.servidorIngesta.listen({ port: 0, host: "127.0.0.1" });
}
