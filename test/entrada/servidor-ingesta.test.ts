import { createHmac } from "node:crypto";
import { FastifyInstance } from "fastify";
import { crearServidorIngesta } from "../../app/entrada/servidor-ingesta";

const TOKEN_VERIFICACION = "token-de-prueba";
const SECRETO_APP = "secreto-de-prueba";

describe("servidor de ingesta", () => {
  let servidor: FastifyInstance;
  let url: string;

  beforeEach(async () => {
    servidor = crearServidorIngesta({ tokenVerificacion: TOKEN_VERIFICACION, secretoApp: SECRETO_APP });
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

  describe("POST /webhook", () => {
    function notificar(cuerpo: string, firma: string | undefined): Promise<Response> {
      const encabezados: Record<string, string> = { "content-type": "application/json" };
      if (firma !== undefined) {
        encabezados["x-hub-signature-256"] = firma;
      }
      return fetch(`${url}/webhook`, { method: "POST", headers: encabezados, body: cuerpo });
    }

    function firmar(cuerpo: string, secreto: string): string {
      return `sha256=${createHmac("sha256", secreto).update(cuerpo).digest("hex")}`;
    }

    test("deberia aceptar una notificacion firmada con el secreto de la app", async () => {
      const cuerpo = JSON.stringify({ object: "whatsapp_business_account", entry: [] });

      const respuesta = await notificar(cuerpo, firmar(cuerpo, SECRETO_APP));

      expect(respuesta.status).toBe(200);
    });

    test("deberia rechazar una notificacion con firma invalida", async () => {
      const cuerpo = JSON.stringify({ object: "whatsapp_business_account", entry: [] });

      const respuesta = await notificar(cuerpo, firmar(cuerpo, "otro-secreto"));

      expect(respuesta.status).toBe(401);
    });

    test("deberia rechazar una notificacion sin firma", async () => {
      const cuerpo = JSON.stringify({ object: "whatsapp_business_account", entry: [] });

      const respuesta = await notificar(cuerpo, undefined);

      expect(respuesta.status).toBe(401);
    });
  });
});
