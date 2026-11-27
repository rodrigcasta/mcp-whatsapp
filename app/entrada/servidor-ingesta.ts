import Fastify, { FastifyInstance } from "fastify";
import { DatosDeMensajeInvalidos } from "../dominio/datos-de-mensaje-invalidos";
import { NumeroNoConectado } from "../dominio/numero-no-conectado";
import { SistemaMensajes } from "../dominio/sistema-mensajes";
import { esFirmaDeMetaValida } from "./firma-meta";
import { extraerMensajesEntrantes } from "./notificacion-meta";

export interface ConfiguracionIngesta {
  tokenVerificacion: string;
  secretoApp: string;
  sistemaMensajes: Pick<SistemaMensajes, "registrarEntrante">;
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

  // La firma se calcula sobre el cuerpo crudo, así que el JSON se guarda como Buffer y se interpreta después de
  // validarla.
  servidor.addContentTypeParser("application/json", { parseAs: "buffer" }, (_pedido, cuerpo, listo) => {
    listo(null, cuerpo);
  });

  servidor.post<{ Body: Buffer }>("/webhook", async (pedido, respuesta) => {
    const firma = pedido.headers["x-hub-signature-256"];
    if (!esFirmaDeMetaValida(pedido.body, typeof firma === "string" ? firma : undefined, configuracion.secretoApp)) {
      return respuesta.code(401).send();
    }

    let cuerpo: unknown;
    try {
      cuerpo = JSON.parse(pedido.body.toString("utf8"));
    } catch {
      return respuesta.code(400).send();
    }

    // Meta reintenta durante días toda notificación que no recibe un 200. Un mensaje que nunca se va a poder
    // registrar se descarta y queda en el log, en lugar de devolver un error que sólo provocaría reintentos.
    for (const entrante of extraerMensajesEntrantes(cuerpo)) {
      try {
        await configuracion.sistemaMensajes.registrarEntrante(entrante);
      } catch (error) {
        if (!(error instanceof NumeroNoConectado || error instanceof DatosDeMensajeInvalidos)) {
          throw error;
        }
        pedido.log.warn({ idWhatsApp: entrante.idWhatsApp, motivo: error.message }, "Mensaje descartado");
      }
    }
    return respuesta.code(200).send();
  });

  return servidor;
}
