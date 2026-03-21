#!/usr/bin/env sh
set -eu

if [ "$#" -lt 4 ] || [ "$#" -gt 5 ]; then
  echo "Usage: ./scripts/migrate-storage-images.sh /absolute/path/to/old-service-account.json /absolute/path/to/new-service-account.json old-bucket new-bucket [--dry-run]" >&2
  exit 1
fi

OLD_KEY_PATH="$1"
NEW_KEY_PATH="$2"
OLD_BUCKET="$3"
NEW_BUCKET="$4"
DRY_RUN_FLAG="${5:-}"

docker run --rm \
  -v "$PWD":/workspace \
  -v /Users/jaredjenkins:/Users/jaredjenkins:ro \
  -w /workspace \
  node:22 \
  sh -lc "node scripts/migrate-storage-images.mjs \"$OLD_KEY_PATH\" \"$NEW_KEY_PATH\" \"$OLD_BUCKET\" \"$NEW_BUCKET\" ${DRY_RUN_FLAG:+$DRY_RUN_FLAG}"
