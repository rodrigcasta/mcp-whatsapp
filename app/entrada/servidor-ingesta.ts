import Fastify, { FastifyInstance } from "fastify";

export function crearServidorIngesta(): FastifyInstance {
  const servidor = Fastify({ logger: process.env.MOSTRAR_LOG === "1" });

  servidor.get("/salud", async () => ({ estado: "activo" }));

  return servidor;
}
