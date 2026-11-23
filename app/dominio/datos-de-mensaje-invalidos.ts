export class DatosDeMensajeInvalidos extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "DatosDeMensajeInvalidos";
  }
}
