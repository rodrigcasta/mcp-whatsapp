export type Direccion = "entrante" | "saliente";

export interface DatosMensaje {
  idWhatsApp: string;
  orgId: string;
  usuarioId: string;
  telefonoContacto: string;
  nombreContacto?: string;
  texto: string;
  enviadoEn: Date;
  direccion: Direccion;
}

export class Mensaje {
  readonly idWhatsApp: string;
  readonly orgId: string;
  readonly usuarioId: string;
  readonly telefonoContacto: string;
  readonly nombreContacto?: string;
  readonly texto: string;
  readonly enviadoEn: Date;
  readonly direccion: Direccion;

  constructor(datos: DatosMensaje) {
    this.idWhatsApp = datos.idWhatsApp;
    this.orgId = datos.orgId;
    this.usuarioId = datos.usuarioId;
    this.telefonoContacto = datos.telefonoContacto;
    this.nombreContacto = datos.nombreContacto;
    this.texto = datos.texto;
    this.enviadoEn = datos.enviadoEn;
    this.direccion = datos.direccion;
  }
}
