#!/usr/bin/env sh
set -eu

usage() {
  echo "Usage: $0 /absolute/path/to/gcp-service-account.json [project-id] [bucket-name]"
  echo
  echo "Defaults:"
  echo "  project-id  -> value from .firebaserc (currently: aspenleafshelties)"
  echo "  bucket-name -> value from src/environments/environment.prod.ts (currently: aspenleafshelties.appspot.com)"
  echo
  echo "Example:"
  echo "  $0 /absolute/path/to/service-account.json"
  echo "  $0 /absolute/path/to/service-account.json aspenleafshelties aspenleafshelties.appspot.com"
  exit 1
}

if [ $# -lt 1 ] || [ $# -gt 3 ]; then
  usage
fi

SERVICE_ACCOUNT_PATH="$1"
PROJECT_ID="${2:-aspenleafshelties}"
BUCKET_NAME="${3:-aspenleafshelties.appspot.com}"

if [ ! -f "$SERVICE_ACCOUNT_PATH" ]; then
  echo "Service account file not found: $SERVICE_ACCOUNT_PATH" >&2
  exit 1
fi

TIMESTAMP="$(date -u +"%Y-%m-%dT%H-%M-%SZ")"
EXPORT_PATH="gs://${BUCKET_NAME}/backups/firestore/${PROJECT_ID}/${TIMESTAMP}"

echo "Starting Firestore export"
echo "Project:     ${PROJECT_ID}"
echo "Bucket:      gs://${BUCKET_NAME}"
echo "Destination: ${EXPORT_PATH}"

docker run --rm \
  -v "$SERVICE_ACCOUNT_PATH":/tmp/gcp-service-account.json:ro \
  -e CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE=/tmp/gcp-service-account.json \
  -e GOOGLE_APPLICATION_CREDENTIALS=/tmp/gcp-service-account.json \
  gcr.io/google.com/cloudsdktool/google-cloud-cli:slim \
  sh -lc "gcloud auth activate-service-account --key-file=/tmp/gcp-service-account.json >/dev/null && gcloud config set project ${PROJECT_ID} >/dev/null && gcloud firestore export ${EXPORT_PATH}"

echo
echo "Firestore backup complete:"
echo "  ${EXPORT_PATH}"
