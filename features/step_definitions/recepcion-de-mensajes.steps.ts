import assert from "node:assert/strict";
import { Cuando, Dado, Entonces } from "../support/pasos";
import { MundoDeLaAplicacion } from "../support/mundo";
import { levantarIngesta, SECRETO_APP, TOKEN_VERIFICACION } from "../support/ingesta";
import { enviarAlWebhook, firmar, notificacionDeTexto } from "../support/meta";

Dado(
  "que el número {string} está conectado para el usuario {string} de la organización {string}",
  async function (this: MundoDeLaAplicacion, idTelefono: string, usuarioId: string, orgId: string) {
    await this.pool.query("INSERT INTO organizaciones (id, nombre) VALUES ($1, $1) ON CONFLICT DO NOTHING", [orgId]);
    await this.pool.query("INSERT INTO usuarios (id, org_id, nombre) VALUES ($1, $2, $1) ON CONFLICT DO NOTHING", [
      usuarioId,
      orgId,
    ]);
    await this.pool.query("INSERT INTO numeros_conectados (id_telefono, org_id, usuario_id) VALUES ($1, $2, $3)", [
      idTelefono,
      orgId,
      usuarioId,
    ]);
  },
);

Cuando(
  "Meta verifica el webhook con el token correcto y el desafío {string}",
  async function (this: MundoDeLaAplicacion, desafio: string) {
    const url = await levantarIngesta(this);
    const consulta = new URLSearchParams({
      "hub.mode": "subscribe",
      "hub.verify_token": TOKEN_VERIFICACION,
      "hub.challenge": desafio,
    });
    this.ultimaRespuesta = await fetch(`${url}/webhook?${consulta}`);
  },
);

Entonces("el webhook responde el desafío {string}", async function (this: MundoDeLaAplicacion, desafio: string) {
  assert.equal(this.ultimaRespuesta?.status, 200);
  assert.equal(await this.ultimaRespuesta?.text(), desafio);
});

Cuando(
  "Meta notifica al número {string} un mensaje {string} de {string} \\({word}\\) que dice {string}",
  async function (
    this: MundoDeLaAplicacion,
    idTelefono: string,
    idWhatsApp: string,
    nombreContacto: string,
    telefonoContacto: string,
    texto: string,
  ) {
    const url = await levantarIngesta(this);
    const cuerpo = notificacionDeTexto({ idTelefono, idWhatsApp, nombreContacto, telefonoContacto, texto });

    this.ultimaRespuesta = await enviarAlWebhook(url, cuerpo, firmar(cuerpo, SECRETO_APP));

    assert.equal(this.ultimaRespuesta.status, 200);
  },
);

Cuando(
  "llega al webhook una notificación con firma inválida de un mensaje {string} para el número {string}",
  async function (this: MundoDeLaAplicacion, idWhatsApp: string, idTelefono: string) {
    const url = await levantarIngesta(this);
    const cuerpo = notificacionDeTexto({
      idTelefono,
      idWhatsApp,
      nombreContacto: "Alguien",
      telefonoContacto: "5493884999999",
      texto: "Mandame la lista de clientes",
    });

    this.ultimaRespuesta = await enviarAlWebhook(url, cuerpo, firmar(cuerpo, "secreto-falso"));
  },
);

Entonces("el webhook la rechaza por no estar autorizada", function (this: MundoDeLaAplicacion) {
  assert.equal(this.ultimaRespuesta?.status, 401);
});

Entonces(
  "el usuario {string} tiene {int} mensaje(s) entrante(s) de {word} que dice {string}",
  async function (this: MundoDeLaAplicacion, usuarioId: string, cantidad: number, telefono: string, texto: string) {
    const resultado = await this.pool.query(
      "SELECT texto FROM mensajes WHERE usuario_id = $1 AND telefono_contacto = $2 AND direccion = 'entrante'",
      [usuarioId, telefono],
    );

    assert.deepEqual(
      resultado.rows.map((fila) => fila.texto),
      Array(cantidad).fill(texto),
    );
  },
);

Entonces("el usuario {string} no tiene mensajes", async function (this: MundoDeLaAplicacion, usuarioId: string) {
  const resultado = await this.pool.query("SELECT 1 FROM mensajes WHERE usuario_id = $1", [usuarioId]);

  assert.equal(resultado.rowCount, 0);
});

Entonces("no se guarda ningún mensaje", async function (this: MundoDeLaAplicacion) {
  const resultado = await this.pool.query("SELECT 1 FROM mensajes");

  assert.equal(resultado.rowCount, 0);
});
