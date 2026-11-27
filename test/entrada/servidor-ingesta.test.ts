import { FastifyInstance } from "fastify";
import { crearServidorIngesta } from "../../app/entrada/servidor-ingesta";

const TOKEN_VERIFICACION = "token-de-prueba";

describe("servidor de ingesta", () => {
  let servidor: FastifyInstance;
  let url: string;

  beforeEach(async () => {
    servidor = crearServidorIngesta({ tokenVerificacion: TOKEN_VERIFICACION });
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

  describe("GET /webhook", () => {
    function verificar(modo: string, token: string, desafio: string): Promise<Response> {
      const consulta = new URLSearchParams({
        "hub.mode": modo,
        "hub.verify_token": token,
        "hub.challenge": desafio,
      });
      return fetch(`${url}/webhook?${consulta}`);
    }

    test("deberia responder el desafio cuando Meta manda el token configurado", async () => {
      const respuesta = await verificar("subscribe", TOKEN_VERIFICACION, "1158201444");

      expect(respuesta.status).toBe(200);
      expect(await respuesta.text()).toBe("1158201444");
    });

    test("deberia rechazar la verificacion con un token distinto", async () => {
      const respuesta = await verificar("subscribe", "otro-token", "1158201444");

      expect(respuesta.status).toBe(403);
    });

    test("deberia rechazar la verificacion si el modo no es subscribe", async () => {
      const respuesta = await verificar("unsubscribe", TOKEN_VERIFICACION, "1158201444");

      expect(respuesta.status).toBe(403);
    });
  });
});
