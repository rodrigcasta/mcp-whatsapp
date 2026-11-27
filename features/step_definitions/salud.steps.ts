import assert from "node:assert/strict";
import { Cuando, Dado, Entonces } from "../support/pasos";
import { MundoDeLaAplicacion } from "../support/mundo";
import { crearServidorIngesta } from "../../app/entrada/servidor-ingesta";

Dado("que el servicio de ingesta está levantado", async function (this: MundoDeLaAplicacion) {
  this.servidorIngesta = crearServidorIngesta({ tokenVerificacion: "token-de-prueba" });
  this.urlIngesta = await this.servidorIngesta.listen({ port: 0, host: "127.0.0.1" });
});

Cuando("consulto su estado", async function (this: MundoDeLaAplicacion) {
  this.ultimaRespuesta = await fetch(`${this.urlIngesta}/salud`);
});

Entonces("responde que está activo", async function (this: MundoDeLaAplicacion) {
  assert.equal(this.ultimaRespuesta?.status, 200);
  assert.deepEqual(await this.ultimaRespuesta?.json(), { estado: "activo" });
});
