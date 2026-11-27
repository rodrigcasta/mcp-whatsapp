import { Pool } from "pg";
import { NumeroConectado } from "../dominio/numero-conectado";
import { IRepositorioNumeroConectado } from "../dominio/puerto-repositorio-numero-conectado";

export class RepositorioNumeroConectadoSql implements IRepositorioNumeroConectado {
  constructor(private readonly pool: Pool) {}

  async recuperarPorIdTelefono(idTelefono: string): Promise<NumeroConectado | undefined> {
    const resultado = await this.pool.query<{ id_telefono: string; org_id: string; usuario_id: string }>(
      "SELECT id_telefono, org_id, usuario_id FROM numeros_conectados WHERE id_telefono = $1",
      [idTelefono],
    );
    const fila = resultado.rows[0];
    if (fila === undefined) {
      return undefined;
    }
    return { idTelefono: fila.id_telefono, orgId: fila.org_id, usuarioId: fila.usuario_id };
  }
}
