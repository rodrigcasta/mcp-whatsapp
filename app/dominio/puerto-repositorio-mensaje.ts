import { Mensaje } from "./mensaje";

export interface IRepositorioMensaje {
  guardar(mensaje: Mensaje): Promise<void>;
  existe(idWhatsApp: string): Promise<boolean>;
}
