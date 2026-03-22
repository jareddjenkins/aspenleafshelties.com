#!/usr/bin/env sh
set -eu

PROJECT_ID="${1:-demo-aspenleafshelties}"
shift $(( $# > 0 ? 1 : 0 ))

docker run --rm \
  --add-host=host.docker.internal:host-gateway \
  -v "$PWD":/workspace \
  -w /workspace \
  -e FIREBASE_PROJECT_ID="$PROJECT_ID" \
  -e FIRESTORE_EMULATOR_HOST=host.docker.internal:8080 \
  node:22 \
  sh -lc "npm install && node ./scripts/migrate-dog-doc-ids.mjs --project-id ${PROJECT_ID} --emulator-host host.docker.internal:8080 $*"
