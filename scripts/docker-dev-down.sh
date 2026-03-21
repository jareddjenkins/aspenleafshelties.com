#!/usr/bin/env sh
set -eu

docker compose stop frontend-dev

if [ -n "$(docker compose ps -q firebase-emulators)" ]; then
  docker compose exec -T firebase-emulators \
    sh -lc "mkdir -p .firebase/emulator-data && firebase emulators:export --project demo-aspenleafshelties .firebase/emulator-data"
  docker compose stop firebase-emulators
fi
