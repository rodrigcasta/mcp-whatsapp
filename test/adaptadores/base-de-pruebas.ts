import { Pool } from "pg";
import { crearPool } from "../../app/adaptadores/crear-pool";

// Las pruebas de adaptadores corren contra test_db (puerto 5434), nunca contra la base de desarrollo.
export function crearPoolDePruebas(): Pool {
  return crearPool({ ...process.env, POSTGRES_PORT: process.env.POSTGRES_PORT ?? "5434" });
}

export async function vaciarBase(pool: Pool): Promise<void> {
  await pool.query("TRUNCATE organizaciones, usuarios, numeros_conectados CASCADE");
}

export async function conectarNumero(
  pool: Pool,
  datos: { idTelefono: string; orgId: string; usuarioId: string },
): Promise<void> {
  await pool.query("INSERT INTO organizaciones (id, nombre) VALUES ($1, $1) ON CONFLICT DO NOTHING", [datos.orgId]);
  await pool.query("INSERT INTO usuarios (id, org_id, nombre) VALUES ($1, $2, $1) ON CONFLICT DO NOTHING", [
    datos.usuarioId,
    datos.orgId,
  ]);
  await pool.query("INSERT INTO numeros_conectados (id_telefono, org_id, usuario_id) VALUES ($1, $2, $3)", [
    datos.idTelefono,
    datos.orgId,
    datos.usuarioId,
  ]);
}
