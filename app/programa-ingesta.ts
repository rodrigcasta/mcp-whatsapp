import { crearServidorIngesta } from "./entrada/servidor-ingesta";

function requerida(nombre: string): string {
  const valor = process.env[nombre];
  if (valor === undefined || valor === "") {
    throw new Error(`Falta la variable de entorno ${nombre}`);
  }
  return valor;
}

const PUERTO = Number(process.env.PUERTO ?? 3000);

const servidor = crearServidorIngesta({
  tokenVerificacion: requerida("META_TOKEN_VERIFICACION"),
  secretoApp: requerida("META_SECRETO_APP"),
});

servidor.listen({ port: PUERTO, host: "0.0.0.0" }).catch((error) => {
  console.error(error);
  process.exit(1);
});
