import { NumeroConectado } from "./numero-conectado";

export interface IRepositorioNumeroConectado {
  recuperarPorIdTelefono(idTelefono: string): Promise<NumeroConectado | undefined>;
}
