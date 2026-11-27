import { createHmac, timingSafeEqual } from "node:crypto";

// Meta firma cada notificación con HMAC-SHA256 del cuerpo crudo, usando el secreto de la app, y manda la firma en
// el encabezado X-Hub-Signature-256 con el formato "sha256=<hex>".
export function esFirmaDeMetaValida(cuerpo: Buffer, encabezado: string | undefined, secretoApp: string): boolean {
  if (encabezado === undefined || !encabezado.startsWith("sha256=")) {
    return false;
  }
  const recibida = Buffer.from(encabezado.slice("sha256=".length), "hex");
  const esperada = createHmac("sha256", secretoApp).update(cuerpo).digest();
  return recibida.length === esperada.length && timingSafeEqual(recibida, esperada);
}
