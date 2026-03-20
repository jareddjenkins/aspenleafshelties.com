#!/usr/bin/env sh
set -eu

CHANNEL_ID="${1:-preview}"

mkdir -p .firebase-config

docker run --rm \
  -v "$PWD":/workspace \
  -w /workspace \
  node:22 \
  sh -lc "npm install && npm run build"

docker run --rm -it \
  -v "$PWD":/workspace \
  -v "$PWD/.firebase-config":/root/.config/configstore \
  -w /workspace \
  node:22 \
  sh -lc "npx firebase-tools@latest hosting:channel:deploy ${CHANNEL_ID}"
