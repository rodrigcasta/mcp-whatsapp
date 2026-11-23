#!/bin/bash
# Contrato del proyecto: lo que pasa acá es lo que corre el CI en cada push y en cada PR.
# Se corta en el primer error, así que si el linter falla no se llega a las pruebas.

set -e
set -x

yarn install --frozen-lockfile
yarn lint
yarn typecheck
yarn test
yarn test:aceptacion
