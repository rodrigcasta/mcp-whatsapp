import { mock, MockProxy } from "jest-mock-extended";
import { Mensaje } from "../../app/dominio/mensaje";
import { NumeroNoConectado } from "../../app/dominio/numero-no-conectado";
import { IRepositorioMensaje } from "../../app/dominio/puerto-repositorio-mensaje";
import { IRepositorioNumeroConectado } from "../../app/dominio/puerto-repositorio-numero-conectado";
import { MensajeEntrante, SistemaMensajes } from "../../app/dominio/sistema-mensajes";

const ENVIADO_EN = new Date("2026-11-23T14:00:00Z");

const ENTRANTE: MensajeEntrante = {
  idTelefonoDestino: "100200300",
  idWhatsApp: "wamid.1",
  telefonoContacto: "5493884111111",
  nombreContacto: "Juan Pérez",
  texto: "Hola",
  enviadoEn: ENVIADO_EN,
};

describe("SistemaMensajes", () => {
  let repositorioMensajes: MockProxy<IRepositorioMensaje>;
  let repositorioNumeros: MockProxy<IRepositorioNumeroConectado>;
  let sistema: SistemaMensajes;

  beforeEach(() => {
    repositorioMensajes = mock<IRepositorioMensaje>();
    repositorioNumeros = mock<IRepositorioNumeroConectado>();
    repositorioNumeros.recuperarPorIdTelefono
      .calledWith("100200300")
      .mockResolvedValue({ idTelefono: "100200300", orgId: "estudio", usuarioId: "rodrigo" });
    sistema = new SistemaMensajes(repositorioMensajes, repositorioNumeros);
  });

  describe("registrarEntrante", () => {
    test("deberia guardar el mensaje a nombre del dueño del numero que lo recibio", async () => {
      await sistema.registrarEntrante(ENTRANTE);

      expect(repositorioMensajes.guardar).toHaveBeenCalledWith(
        new Mensaje({
          idWhatsApp: "wamid.1",
          orgId: "estudio",
          usuarioId: "rodrigo",
          telefonoContacto: "5493884111111",
          nombreContacto: "Juan Pérez",
          texto: "Hola",
          enviadoEn: ENVIADO_EN,
          direccion: "entrante",
        }),
      );
    });

    test("deberia impedir registrar un mensaje para un numero que no esta conectado", async () => {
      const entrante = { ...ENTRANTE, idTelefonoDestino: "999999999" };

      const registro = sistema.registrarEntrante(entrante);

      await expect(registro).rejects.toThrow(NumeroNoConectado);
      await expect(registro).rejects.toThrow("El número 999999999 no está conectado");
      expect(repositorioMensajes.guardar).not.toHaveBeenCalled();
    });

    test("deberia ignorar un mensaje que ya fue registrado", async () => {
      repositorioMensajes.existe.calledWith("wamid.1").mockResolvedValue(true);

      await sistema.registrarEntrante(ENTRANTE);

      expect(repositorioMensajes.guardar).not.toHaveBeenCalled();
    });
  });
});
