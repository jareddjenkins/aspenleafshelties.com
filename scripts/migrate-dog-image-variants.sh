#!/usr/bin/env sh
set -eu

usage() {
  echo "Usage:"
  echo "  $0 --adc firebase-project-id [--bucket storage-bucket] [--dry-run] [--delete-legacy]"
  echo "  $0 /absolute/path/to/firebase-service-account.json firebase-project-id [--bucket storage-bucket] [--dry-run] [--delete-legacy]"
  exit 1
}

if [ $# -lt 2 ]; then
  usage
fi

if [ "$1" = "--adc" ]; then
  PROJECT_ID="$2"
  shift 2

  ADC_PATH="${HOME}/.config/gcloud/application_default_credentials.json"
  if [ ! -f "$ADC_PATH" ]; then
    echo "Missing ADC credentials at $ADC_PATH" >&2
    echo "Run: gcloud auth application-default login" >&2
    exit 1
  fi

  docker run --rm \
    -v "$PWD":/workspace \
    -v "$ADC_PATH":/tmp/application_default_credentials.json:ro \
    -w /workspace \
    -e GOOGLE_APPLICATION_CREDENTIALS=/tmp/application_default_credentials.json \
    -e FIREBASE_PROJECT_ID="$PROJECT_ID" \
    -e FIREBASE_STORAGE_BUCKET="${FIREBASE_STORAGE_BUCKET:-}" \
    node:22 \
    sh -lc "npm install && node ./scripts/migrate-dog-image-variants.mjs --project-id ${PROJECT_ID} $*"

  exit 0
fi

SERVICE_ACCOUNT_PATH="$1"
PROJECT_ID="$2"
shift 2

if [ ! -f "$SERVICE_ACCOUNT_PATH" ]; then
  echo "Service account file not found: $SERVICE_ACCOUNT_PATH" >&2
  exit 1
fi

docker run --rm \
  -v "$PWD":/workspace \
  -v "$SERVICE_ACCOUNT_PATH":/tmp/firebase-service-account.json:ro \
  -w /workspace \
  -e GOOGLE_APPLICATION_CREDENTIALS=/tmp/firebase-service-account.json \
  -e FIREBASE_PROJECT_ID="$PROJECT_ID" \
  -e FIREBASE_STORAGE_BUCKET="${FIREBASE_STORAGE_BUCKET:-}" \
  node:22 \
  sh -lc "npm install && node ./scripts/migrate-dog-image-variants.mjs --project-id ${PROJECT_ID} $*"
