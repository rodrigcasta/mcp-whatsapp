import Fastify, { FastifyInstance } from "fastify";

export interface ConfiguracionIngesta {
  tokenVerificacion: string;
}

interface ConsultaVerificacion {
  "hub.mode"?: string;
  "hub.verify_token"?: string;
  "hub.challenge"?: string;
}

export function crearServidorIngesta(configuracion: ConfiguracionIngesta): FastifyInstance {
  const servidor = Fastify({ logger: process.env.MOSTRAR_LOG === "1" });

  servidor.get("/salud", async () => ({ estado: "activo" }));

  // Meta verifica la URL del webhook al configurarlo: manda el token que se cargó en su panel y espera recibir
  // el desafío de vuelta.
  servidor.get<{ Querystring: ConsultaVerificacion }>("/webhook", async (pedido, respuesta) => {
    const consulta = pedido.query;
    if (consulta["hub.mode"] !== "subscribe" || consulta["hub.verify_token"] !== configuracion.tokenVerificacion) {
      return respuesta.code(403).send();
    }
    return respuesta.type("text/plain").send(consulta["hub.challenge"] ?? "");
  });

  return servidor;
}
