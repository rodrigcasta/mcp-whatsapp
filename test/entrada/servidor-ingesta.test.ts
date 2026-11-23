import { FastifyInstance } from "fastify";
import { crearServidorIngesta } from "../../app/entrada/servidor-ingesta";

describe("servidor de ingesta", () => {
  let servidor: FastifyInstance;
  let url: string;

  beforeEach(async () => {
    servidor = crearServidorIngesta();
    url = await servidor.listen({ port: 0, host: "127.0.0.1" });
  });

  afterEach(async () => {
    await servidor.close();
  });

  describe("GET /salud", () => {
    test("deberia responder que el servicio esta activo", async () => {
      const respuesta = await fetch(`${url}/salud`);

      expect(respuesta.status).toBe(200);
      expect(await respuesta.json()).toEqual({ estado: "activo" });
    });
  });
});
