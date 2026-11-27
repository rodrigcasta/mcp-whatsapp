#!/bin/bash
# Contrato del proyecto: lo que pasa acá es lo que corre el CI en cada push y en cada PR.
# Se corta en el primer error, así que si el linter falla no se llega a las pruebas.

set -e
set -x

yarn install --frozen-lockfile
yarn lint
yarn typecheck

# Base de pruebas recreada desde cero con todas las migraciones
docker compose up -d --wait test_db
docker compose run --rm flyway-test

yarn test
yarn test:aceptacion
