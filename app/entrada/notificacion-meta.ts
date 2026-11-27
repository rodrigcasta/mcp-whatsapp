import { MensajeEntrante } from "../dominio/sistema-mensajes";

// Forma de las notificaciones del webhook de WhatsApp Cloud API. Sólo se declara lo que se usa.
interface NotificacionMeta {
  entry?: {
    changes?: {
      field?: string;
      value?: {
        metadata?: { phone_number_id?: string };
        contacts?: { wa_id?: string; profile?: { name?: string } }[];
        messages?: { id?: string; from?: string; timestamp?: string; type?: string; text?: { body?: string } }[];
      };
    }[];
  }[];
}

export function extraerMensajesEntrantes(cuerpo: unknown): MensajeEntrante[] {
  const notificacion = cuerpo as NotificacionMeta;
  const entrantes: MensajeEntrante[] = [];

  for (const entrada of notificacion.entry ?? []) {
    for (const cambio of entrada.changes ?? []) {
      if (cambio.field !== "messages" || cambio.value === undefined) {
        continue;
      }
      const { metadata, contacts = [], messages = [] } = cambio.value;
      for (const mensaje of messages) {
        if (mensaje.type !== "text") {
          continue;
        }
        const contacto = contacts.find((c) => c.wa_id === mensaje.from);
        entrantes.push({
          idTelefonoDestino: metadata?.phone_number_id ?? "",
          idWhatsApp: mensaje.id ?? "",
          telefonoContacto: mensaje.from ?? "",
          nombreContacto: contacto?.profile?.name,
          texto: mensaje.text?.body ?? "",
          enviadoEn: new Date(Number(mensaje.timestamp) * 1000),
        });
      }
    }
  }

  return entrantes;
}
