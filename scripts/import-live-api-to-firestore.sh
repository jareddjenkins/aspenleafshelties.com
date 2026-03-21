#!/usr/bin/env sh
set -eu

if [ $# -lt 2 ]; then
  echo "Usage: $0 /absolute/path/to/firebase-service-account.json firebase-project-id [--dry-run]"
  exit 1
fi

SERVICE_ACCOUNT_PATH="$1"
PROJECT_ID="$2"
shift 2

docker run --rm \
  -v "$PWD":/workspace \
  -v "$SERVICE_ACCOUNT_PATH":/tmp/firebase-service-account.json:ro \
  -w /workspace \
  -e GOOGLE_APPLICATION_CREDENTIALS=/tmp/firebase-service-account.json \
  -e FIREBASE_PROJECT_ID="$PROJECT_ID" \
  node:22 \
  sh -lc "npm install && node ./scripts/import-live-api-to-firestore.mjs $*"
