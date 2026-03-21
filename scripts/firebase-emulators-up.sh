#!/usr/bin/env sh
set -eu

docker compose up --build --force-recreate firebase-emulators
