import { DatosDeMensajeInvalidos } from "../../app/dominio/datos-de-mensaje-invalidos";
import { DatosMensaje, Mensaje } from "../../app/dominio/mensaje";

const ENVIADO_EN = new Date("2026-11-23T14:00:00Z");

function datosValidos(cambios: Partial<DatosMensaje> = {}): DatosMensaje {
  return {
    idWhatsApp: "wamid.1",
    orgId: "estudio",
    usuarioId: "rodrigo",
    telefonoContacto: "5493884111111",
    nombreContacto: "Juan Pérez",
    texto: "Hola",
    enviadoEn: ENVIADO_EN,
    direccion: "entrante",
    ...cambios,
  };
}

describe("Mensaje", () => {
  describe("constructor", () => {
    test("deberia crear un mensaje entrante con sus datos", () => {
      const mensaje = new Mensaje(datosValidos());

      expect(mensaje.idWhatsApp).toBe("wamid.1");
      expect(mensaje.orgId).toBe("estudio");
      expect(mensaje.usuarioId).toBe("rodrigo");
      expect(mensaje.telefonoContacto).toBe("5493884111111");
      expect(mensaje.nombreContacto).toBe("Juan Pérez");
      expect(mensaje.texto).toBe("Hola");
      expect(mensaje.enviadoEn).toEqual(ENVIADO_EN);
      expect(mensaje.direccion).toBe("entrante");
    });

    test("deberia impedir crear un mensaje sin id de WhatsApp", () => {
      const datos = datosValidos({ idWhatsApp: " " });

      expect(() => new Mensaje(datos)).toThrow(DatosDeMensajeInvalidos);
      expect(() => new Mensaje(datos)).toThrow("El id de WhatsApp del mensaje es obligatorio");
    });

    test("deberia impedir crear un mensaje sin telefono del contacto", () => {
      const datos = datosValidos({ telefonoContacto: "" });

      expect(() => new Mensaje(datos)).toThrow(DatosDeMensajeInvalidos);
      expect(() => new Mensaje(datos)).toThrow("El teléfono del contacto es obligatorio");
    });

    test("deberia impedir crear un mensaje con fecha de envio invalida", () => {
      const datos = datosValidos({ enviadoEn: new Date("no es fecha") });

      expect(() => new Mensaje(datos)).toThrow(DatosDeMensajeInvalidos);
      expect(() => new Mensaje(datos)).toThrow("La fecha de envío es inválida");
    });
  });
});
