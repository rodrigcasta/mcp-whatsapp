export class NumeroNoConectado extends Error {
  constructor(idTelefono: string) {
    super(`El número ${idTelefono} no está conectado`);
    this.name = "NumeroNoConectado";
  }
}
