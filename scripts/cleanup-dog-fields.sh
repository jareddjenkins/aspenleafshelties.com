#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: ./scripts/cleanup-dog-fields.sh <service-account.json or --emulator> [extra args...]"
  exit 1
fi

if [ "$1" = "--emulator" ]; then
  shift
  docker run --rm \
    --add-host=host.docker.internal:host-gateway \
    -v "$PWD":/workspace \
    -w /workspace \
    node:22 \
    sh -lc "npm install && node ./scripts/cleanup-dog-fields.mjs --project-id demo-aspenleafshelties --emulator-host host.docker.internal:8080 $*"
  exit 0
fi

SERVICE_ACCOUNT_PATH="$1"
shift

docker run --rm \
  -v "$PWD":/workspace \
  -v "$SERVICE_ACCOUNT_PATH":/tmp/service-account.json:ro \
  -w /workspace \
  -e GOOGLE_APPLICATION_CREDENTIALS=/tmp/service-account.json \
  node:22 \
  sh -lc "npm install && node ./scripts/cleanup-dog-fields.mjs --project-id aspenleafshelties $*"
