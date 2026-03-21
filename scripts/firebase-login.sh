#!/usr/bin/env sh
set -eu

mkdir -p .firebase-config

docker run --rm -it \
  -v "$PWD":/workspace \
  -v "$PWD/.firebase-config":/root/.config/configstore \
  -w /workspace \
  node:22 \
  sh -lc "npx --yes firebase-tools@latest login --no-localhost"
