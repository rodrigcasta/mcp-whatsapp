import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { FastifyInstance } from "fastify";

export class MundoDeLaAplicacion extends World {
  servidorIngesta?: FastifyInstance;
  urlIngesta?: string;
  ultimaRespuesta?: Response;

  constructor(opciones: IWorldOptions) {
    super(opciones);
  }
}

setWorldConstructor(MundoDeLaAplicacion);
