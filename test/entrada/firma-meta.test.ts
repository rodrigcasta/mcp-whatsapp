import { createHmac } from "node:crypto";
import { esFirmaDeMetaValida } from "../../app/entrada/firma-meta";

const SECRETO = "secreto-de-prueba";
const CUERPO = Buffer.from('{"object":"whatsapp_business_account"}');

function firmar(cuerpo: Buffer, secreto: string): string {
  return `sha256=${createHmac("sha256", secreto).update(cuerpo).digest("hex")}`;
}

describe("esFirmaDeMetaValida", () => {
  test("deberia aceptar el cuerpo firmado con el secreto de la app", () => {
    const firma = firmar(CUERPO, SECRETO);

    expect(esFirmaDeMetaValida(CUERPO, firma, SECRETO)).toBe(true);
  });

  test("deberia rechazar el cuerpo firmado con otro secreto", () => {
    const firma = firmar(CUERPO, "otro-secreto");

    expect(esFirmaDeMetaValida(CUERPO, firma, SECRETO)).toBe(false);
  });

  test("deberia rechazar un cuerpo modificado despues de firmarlo", () => {
    const firma = firmar(CUERPO, SECRETO);
    const modificado = Buffer.from('{"object":"otra_cosa"}');

    expect(esFirmaDeMetaValida(modificado, firma, SECRETO)).toBe(false);
  });

  test("deberia rechazar una notificacion sin firma", () => {
    expect(esFirmaDeMetaValida(CUERPO, undefined, SECRETO)).toBe(false);
  });

  test("deberia rechazar una firma sin el prefijo sha256", () => {
    const firma = firmar(CUERPO, SECRETO).replace("sha256=", "");

    expect(esFirmaDeMetaValida(CUERPO, firma, SECRETO)).toBe(false);
  });
});
