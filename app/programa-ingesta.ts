import { crearServidorIngesta } from "./entrada/servidor-ingesta";

const PUERTO = Number(process.env.PUERTO ?? 3000);

const servidor = crearServidorIngesta();

servidor.listen({ port: PUERTO, host: "0.0.0.0" }).catch((error) => {
  console.error(error);
  process.exit(1);
});
