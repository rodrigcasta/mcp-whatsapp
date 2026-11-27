import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { crearPoolDeAceptacion } from "./ingesta";

export class MundoDeLaAplicacion extends World {
  readonly pool: Pool = crearPoolDeAceptacion();
  servidorIngesta?: FastifyInstance;
  urlIngesta?: string;
  ultimaRespuesta?: Response;

  constructor(opciones: IWorldOptions) {
    super(opciones);
  }
}

setWorldConstructor(MundoDeLaAplicacion);
