import { Mensaje } from "./mensaje";
import { NumeroNoConectado } from "./numero-no-conectado";
import { IRepositorioMensaje } from "./puerto-repositorio-mensaje";
import { IRepositorioNumeroConectado } from "./puerto-repositorio-numero-conectado";

export interface MensajeEntrante {
  idTelefonoDestino: string;
  idWhatsApp: string;
  telefonoContacto: string;
  nombreContacto?: string;
  texto: string;
  enviadoEn: Date;
}

export class SistemaMensajes {
  constructor(
    private readonly repositorioMensajes: IRepositorioMensaje,
    private readonly repositorioNumeros: IRepositorioNumeroConectado,
  ) {}

  async registrarEntrante(entrante: MensajeEntrante): Promise<void> {
    // Meta reintenta las notificaciones que no recibieron un 200 a tiempo, así que un mismo mensaje puede llegar
    // más de una vez. El reenvío no es un error: se ignora.
    if (await this.repositorioMensajes.existe(entrante.idWhatsApp)) {
      return;
    }

    const numero = await this.repositorioNumeros.recuperarPorIdTelefono(entrante.idTelefonoDestino);
    if (numero === undefined) {
      throw new NumeroNoConectado(entrante.idTelefonoDestino);
    }

    const mensaje = new Mensaje({
      idWhatsApp: entrante.idWhatsApp,
      orgId: numero.orgId,
      usuarioId: numero.usuarioId,
      telefonoContacto: entrante.telefonoContacto,
      nombreContacto: entrante.nombreContacto,
      texto: entrante.texto,
      enviadoEn: entrante.enviadoEn,
      direccion: "entrante",
    });

    await this.repositorioMensajes.guardar(mensaje);
  }
}
