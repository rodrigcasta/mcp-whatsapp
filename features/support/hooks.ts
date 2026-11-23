import { After, setDefaultTimeout } from "@cucumber/cucumber";
import { MundoDeLaAplicacion } from "./mundo";

setDefaultTimeout(15_000);

After(async function (this: MundoDeLaAplicacion) {
  await this.servidorIngesta?.close();
});
