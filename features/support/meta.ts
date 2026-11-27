import { createHmac } from "node:crypto";

// Simula a Meta: arma notificaciones con la forma del webhook de WhatsApp Cloud API y las firma.

export interface DatosNotificacion {
  idTelefono: string;
  idWhatsApp: string;
  nombreContacto: string;
  telefonoContacto: string;
  texto: string;
}

export function notificacionDeTexto(datos: DatosNotificacion): string {
  return JSON.stringify({
    object: "whatsapp_business_account",
    entry: [
      {
        id: "WABA",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              metadata: { display_phone_number: "5493884000000", phone_number_id: datos.idTelefono },
              contacts: [{ profile: { name: datos.nombreContacto }, wa_id: datos.telefonoContacto }],
              messages: [
                {
                  from: datos.telefonoContacto,
                  id: datos.idWhatsApp,
                  timestamp: String(Math.floor(Date.now() / 1000)),
                  type: "text",
                  text: { body: datos.texto },
                },
              ],
            },
          },
        ],
      },
    ],
  });
}

export function firmar(cuerpo: string, secreto: string): string {
  return `sha256=${createHmac("sha256", secreto).update(cuerpo).digest("hex")}`;
}

export function enviarAlWebhook(urlIngesta: string, cuerpo: string, firma: string): Promise<Response> {
  return fetch(`${urlIngesta}/webhook`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-hub-signature-256": firma },
    body: cuerpo,
  });
}
