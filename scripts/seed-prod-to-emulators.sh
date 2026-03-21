#!/usr/bin/env sh
set -eu

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  echo "Usage: ./scripts/seed-prod-to-emulators.sh /absolute/path/to/prod-service-account.json [--dry-run]" >&2
  exit 1
fi

PROD_KEY_PATH="$1"
DRY_RUN_FLAG="${2:-}"

docker run --rm \
  -v "$PWD":/workspace \
  -v /Users/jaredjenkins:/Users/jaredjenkins:ro \
  -w /workspace \
  node:22 \
  sh -lc "node scripts/seed-prod-to-emulators.mjs \"$PROD_KEY_PATH\" ${DRY_RUN_FLAG:+$DRY_RUN_FLAG}"
