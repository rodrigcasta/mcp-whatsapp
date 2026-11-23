import { ProveedorFecha } from "../dominio/proveedor-fecha";

export class ProveedorFechaDelSistema implements ProveedorFecha {
  ahora(): Date {
    return new Date();
  }
}
