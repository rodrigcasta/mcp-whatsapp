import { extraerMensajesEntrantes } from "../../app/entrada/notificacion-meta";

function notificacion(value: object, field = "messages"): object {
  return { object: "whatsapp_business_account", entry: [{ id: "WABA", changes: [{ field, value }] }] };
}

const MENSAJE_DE_TEXTO = {
  messaging_product: "whatsapp",
  metadata: { display_phone_number: "5493884000000", phone_number_id: "100200300" },
  contacts: [{ profile: { name: "Juan Pérez" }, wa_id: "5493884111111" }],
  messages: [
    {
      from: "5493884111111",
      id: "wamid.1",
      timestamp: "1795442400",
      type: "text",
      text: { body: "Hola, ¿tenés el presupuesto?" },
    },
  ],
};

describe("extraerMensajesEntrantes", () => {
  test("deberia traducir un mensaje de texto con su contacto y el numero que lo recibio", () => {
    const entrantes = extraerMensajesEntrantes(notificacion(MENSAJE_DE_TEXTO));

    expect(entrantes).toEqual([
      {
        idTelefonoDestino: "100200300",
        idWhatsApp: "wamid.1",
        telefonoContacto: "5493884111111",
        nombreContacto: "Juan Pérez",
        texto: "Hola, ¿tenés el presupuesto?",
        enviadoEn: new Date(1795442400 * 1000),
      },
    ]);
  });

  test("deberia ignorar los mensajes que no son de texto", () => {
    const audio = { from: "5493884111111", id: "wamid.2", timestamp: "1795442400", type: "audio", audio: {} };

    const entrantes = extraerMensajesEntrantes(notificacion({ ...MENSAJE_DE_TEXTO, messages: [audio] }));

    expect(entrantes).toEqual([]);
  });

  test("deberia ignorar las notificaciones de estado sin mensajes", () => {
    const estados = { metadata: MENSAJE_DE_TEXTO.metadata, statuses: [{ id: "wamid.9", status: "read" }] };

    const entrantes = extraerMensajesEntrantes(notificacion(estados));

    expect(entrantes).toEqual([]);
  });

  test("deberia ignorar los cambios de otros campos", () => {
    const entrantes = extraerMensajesEntrantes(notificacion(MENSAJE_DE_TEXTO, "account_update"));

    expect(entrantes).toEqual([]);
  });

  test("deberia dejar sin nombre al contacto que no viene en la notificacion", () => {
    const entrantes = extraerMensajesEntrantes(notificacion({ ...MENSAJE_DE_TEXTO, contacts: [] }));

    expect(entrantes[0].nombreContacto).toBeUndefined();
  });
});
