import assert from "node:assert/strict";
import { Cuando, Dado, Entonces } from "../support/pasos";
import { MundoDeLaAplicacion } from "../support/mundo";
import { levantarIngesta } from "../support/ingesta";

Dado("que el servicio de ingesta está levantado", async function (this: MundoDeLaAplicacion) {
  await levantarIngesta(this);
});

Cuando("consulto su estado", async function (this: MundoDeLaAplicacion) {
  this.ultimaRespuesta = await fetch(`${this.urlIngesta}/salud`);
});

Entonces("responde que está activo", async function (this: MundoDeLaAplicacion) {
  assert.equal(this.ultimaRespuesta?.status, 200);
  assert.deepEqual(await this.ultimaRespuesta?.json(), { estado: "activo" });
});
