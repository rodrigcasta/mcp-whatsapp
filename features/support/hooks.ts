import { After, Before, setDefaultTimeout } from "@cucumber/cucumber";
import { MundoDeLaAplicacion } from "./mundo";

setDefaultTimeout(15_000);

Before(async function (this: MundoDeLaAplicacion) {
  await this.pool.query("TRUNCATE organizaciones, usuarios, numeros_conectados, mensajes CASCADE");
});

After(async function (this: MundoDeLaAplicacion) {
  await this.servidorIngesta?.close();
  await this.pool.end();
});
