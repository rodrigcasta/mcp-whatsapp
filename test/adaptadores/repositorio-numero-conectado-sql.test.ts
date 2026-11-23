import { Pool } from "pg";
import { RepositorioNumeroConectadoSql } from "../../app/adaptadores/repositorio-numero-conectado-sql";
import { conectarNumero, crearPoolDePruebas, vaciarBase } from "./base-de-pruebas";

describe("RepositorioNumeroConectadoSql", () => {
  let pool: Pool;
  let repositorio: RepositorioNumeroConectadoSql;

  beforeAll(() => {
    pool = crearPoolDePruebas();
    repositorio = new RepositorioNumeroConectadoSql(pool);
  });

  beforeEach(async () => {
    await vaciarBase(pool);
  });

  afterAll(async () => {
    await vaciarBase(pool);
    await pool.end();
  });

  describe("recuperarPorIdTelefono", () => {
    test("deberia recuperar el numero conectado con su organizacion y su usuario", async () => {
      await conectarNumero(pool, { idTelefono: "100200300", orgId: "estudio", usuarioId: "rodrigo" });

      const numero = await repositorio.recuperarPorIdTelefono("100200300");

      expect(numero).toEqual({ idTelefono: "100200300", orgId: "estudio", usuarioId: "rodrigo" });
    });

    test("deberia devolver undefined si el numero no esta conectado", async () => {
      const numero = await repositorio.recuperarPorIdTelefono("999999999");

      expect(numero).toBeUndefined();
    });
  });
});
