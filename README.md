## Build

colima start
docker-buildx build . --platform linux/amd64 -t jareddjenkins/aspenleaf:latest --push

## Local Testing

Production-style local test:
`./scripts/docker-prod-build.sh`
`./scripts/docker-prod-up.sh`

Then open `http://localhost:8081`.

Angular dev server in Docker:
`./scripts/docker-dev-up.sh`

Then open `http://localhost:4200`.

Stop either workflow with:
`./scripts/docker-prod-down.sh`
or
`./scripts/docker-dev-down.sh`

If you do have npm installed, the equivalent shortcuts in `package.json` still work too.
