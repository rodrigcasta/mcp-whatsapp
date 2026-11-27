# mcp-whatsapp

Servidor MCP que conecta WhatsApp Business (Cloud API en modo Coexistencia) con Claude. Claude asiste y la persona
decide: el sistema clasifica, resume, detecta y redacta, y todo envío pasa por confirmación.

## Requisitos

- Node 24 (la versión exacta está en `.nvmrc`)
- yarn 1 (`corepack enable`)
- Docker, para las bases de Postgres de desarrollo y de pruebas

## Comandos

| Comando                | Qué hace                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `./build.sh`           | Instala, corre el linter, el chequeo de tipos y todas las pruebas. Es lo mismo que corre el CI |
| `yarn lint`            | ESLint con Prettier                                                                            |
| `yarn typecheck`       | `tsc --noEmit` en modo strict                                                                  |
| `yarn test`            | Pruebas unitarias y de adaptadores con Jest                                                    |
| `yarn test:aceptacion` | Escenarios de Cucumber, sin los marcados `@wip`                                                |
| `yarn start:ingesta`   | Levanta el servicio de ingesta en el puerto `PUERTO` (3000 por defecto)                        |

Para levantar la ingesta hacen falta, además de las de Postgres, `META_TOKEN_VERIFICACION` (el token que se carga en
el panel de Meta al configurar el webhook) y `META_SECRETO_APP` (el secreto de la app, con el que se valida la firma
`X-Hub-Signature-256` de cada notificación). Ver `.env.ejemplo`.

Variables de depuración: `MOSTRAR_LOG=1` muestra el log de Fastify.

## Bases de datos

`compose.yml` levanta dos Postgres: `dev_db` en el puerto 5433 y `test_db` en el 5434. Las migraciones viven en `db/`
con el formato de Flyway (`V<fecha>.<n>__Descripcion.sql`) y nunca se editan una vez mergeadas: un cambio de esquema
es siempre una migración nueva.

```
docker compose up -d dev_db && docker compose run --rm flyway-dev     # desarrollo
docker compose up -d --wait test_db && docker compose run --rm flyway-test   # pruebas, la recrea desde cero
```

Para desarrollo, copiar `.env.ejemplo` a `.env`.

## Estructura

Arquitectura hexagonal. El dominio no conoce Fastify, Postgres, Meta ni Claude: define los puertos que necesita y los
programas de armado le inyectan las implementaciones.

```
app/
  dominio/       entidades, casos de uso (Sistema*), errores y puertos
  adaptadores/   implementaciones de los puertos de salida (Postgres, reloj, Meta, Claude)
  entrada/       adaptadores de entrada (webhook de Meta, servidor MCP, worker)
  programa-*.ts  armado a mano de cada proceso
test/            pruebas de Jest, con la misma estructura que app/
features/        escenarios de aceptación en Gherkin, en español
```

## Forma de trabajo

- Cada historia empieza por su `.feature` marcado `@wip` en un commit propio, y termina cuando el escenario pasa sin
  `@wip`.
- Después se construye el dominio de a una regla por commit (test y código mínimo juntos), luego el adaptador SQL con
  su migración, y al final la interfaz que hace pasar el escenario.
- Cada commit deja `./build.sh` en verde. Los refactors van en commits separados.
- Mensajes de commit en primera persona y presente, describiendo el comportamiento: "Valido la firma del webhook",
  "Impido mensajes duplicados". Sin prefijos.
- Código en español: clases, métodos y archivos en kebab-case; tests `deberia ...` con preparar, actuar y verificar
  separados por una línea en blanco.
- Se trabaja en ramas cortas que entran a `main` por pull request con el check `build` en verde.
