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

## Firebase Hosting

The Firebase project is set to `aspenleaf-bbc65` in [`.firebaserc`](/Users/jaredjenkins/repos/aspenleafshelties.com/.firebaserc).

One-time login with Dockerized Firebase CLI:
`./scripts/firebase-login.sh`

Build and deploy Hosting:
`./scripts/firebase-deploy.sh`

Deploy to a preview channel:
`./scripts/firebase-preview.sh my-preview`

The Hosting config lives in [firebase.json](/Users/jaredjenkins/repos/aspenleafshelties.com/firebase.json) and is set up for an Angular SPA using `dist/aspenleafshelties` as the deploy directory.
