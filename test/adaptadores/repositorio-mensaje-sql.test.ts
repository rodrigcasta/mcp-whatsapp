import { Pool } from "pg";
import { RepositorioMensajeSql } from "../../app/adaptadores/repositorio-mensaje-sql";
import { DatosMensaje, Mensaje } from "../../app/dominio/mensaje";
import { conectarNumero, crearPoolDePruebas, vaciarBase } from "./base-de-pruebas";

function unMensaje(cambios: Partial<DatosMensaje> = {}): Mensaje {
  return new Mensaje({
    idWhatsApp: "wamid.1",
    orgId: "estudio",
    usuarioId: "rodrigo",
    telefonoContacto: "5493884111111",
    nombreContacto: "Juan Pérez",
    texto: "Hola, ¿tenés el presupuesto?",
    enviadoEn: new Date("2026-11-23T14:00:00Z"),
    direccion: "entrante",
    ...cambios,
  });
}

describe("RepositorioMensajeSql", () => {
  let pool: Pool;
  let repositorio: RepositorioMensajeSql;

  beforeAll(() => {
    pool = crearPoolDePruebas();
    repositorio = new RepositorioMensajeSql(pool);
  });

  beforeEach(async () => {
    await vaciarBase(pool);
    await conectarNumero(pool, { idTelefono: "100200300", orgId: "estudio", usuarioId: "rodrigo" });
  });

  afterAll(async () => {
    await vaciarBase(pool);
    await pool.end();
  });

  describe("guardar", () => {
    test("deberia guardar el mensaje con todos sus datos", async () => {
      const mensaje = unMensaje();

      await repositorio.guardar(mensaje);

      expect(await repositorio.recuperarDeUsuario("estudio", "rodrigo")).toEqual([mensaje]);
    });

    test("deberia guardar un mensaje sin nombre de contacto", async () => {
      const mensaje = unMensaje({ nombreContacto: undefined });

      await repositorio.guardar(mensaje);

      expect(await repositorio.recuperarDeUsuario("estudio", "rodrigo")).toEqual([mensaje]);
    });
  });

  describe("existe", () => {
    test("deberia indicar que existe un mensaje guardado", async () => {
      await repositorio.guardar(unMensaje());

      expect(await repositorio.existe("wamid.1")).toBe(true);
    });

    test("deberia indicar que no existe un mensaje que nunca se guardo", async () => {
      expect(await repositorio.existe("wamid.1")).toBe(false);
    });
  });

  describe("recuperarDeUsuario", () => {
    test("deberia devolver solo los mensajes del usuario, ordenados por fecha de envio", async () => {
      await conectarNumero(pool, { idTelefono: "400500600", orgId: "estudio", usuarioId: "ana" });
      const segundo = unMensaje({ idWhatsApp: "wamid.2", enviadoEn: new Date("2026-11-23T15:00:00Z") });
      const primero = unMensaje({ idWhatsApp: "wamid.1", enviadoEn: new Date("2026-11-23T13:00:00Z") });
      const deOtroUsuario = unMensaje({ idWhatsApp: "wamid.3", usuarioId: "ana" });
      await repositorio.guardar(segundo);
      await repositorio.guardar(primero);
      await repositorio.guardar(deOtroUsuario);

      const mensajes = await repositorio.recuperarDeUsuario("estudio", "rodrigo");

      expect(mensajes).toEqual([primero, segundo]);
    });
  });
});
