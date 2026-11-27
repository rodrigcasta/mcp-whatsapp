import { Pool } from "pg";
import { Direccion, Mensaje } from "../dominio/mensaje";
import { IRepositorioMensaje } from "../dominio/puerto-repositorio-mensaje";

interface FilaMensaje {
  id_whatsapp: string;
  org_id: string;
  usuario_id: string;
  telefono_contacto: string;
  nombre_contacto: string | null;
  texto: string;
  enviado_en: Date;
  direccion: Direccion;
}

export class RepositorioMensajeSql implements IRepositorioMensaje {
  constructor(private readonly pool: Pool) {}

  async guardar(mensaje: Mensaje): Promise<void> {
    await this.pool.query(
      `INSERT INTO mensajes
         (id_whatsapp, org_id, usuario_id, telefono_contacto, nombre_contacto, texto, enviado_en, direccion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        mensaje.idWhatsApp,
        mensaje.orgId,
        mensaje.usuarioId,
        mensaje.telefonoContacto,
        mensaje.nombreContacto ?? null,
        mensaje.texto,
        mensaje.enviadoEn,
        mensaje.direccion,
      ],
    );
  }

  async existe(idWhatsApp: string): Promise<boolean> {
    const resultado = await this.pool.query("SELECT 1 FROM mensajes WHERE id_whatsapp = $1", [idWhatsApp]);
    return resultado.rowCount === 1;
  }

  async recuperarDeUsuario(orgId: string, usuarioId: string): Promise<Mensaje[]> {
    const resultado = await this.pool.query<FilaMensaje>(
      "SELECT * FROM mensajes WHERE org_id = $1 AND usuario_id = $2 ORDER BY enviado_en",
      [orgId, usuarioId],
    );
    return resultado.rows.map(
      (fila) =>
        new Mensaje({
          idWhatsApp: fila.id_whatsapp,
          orgId: fila.org_id,
          usuarioId: fila.usuario_id,
          telefonoContacto: fila.telefono_contacto,
          nombreContacto: fila.nombre_contacto ?? undefined,
          texto: fila.texto,
          enviadoEn: fila.enviado_en,
          direccion: fila.direccion,
        }),
    );
  }
}
