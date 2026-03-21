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

The Firebase project is set to `aspenleafshelties` in [`.firebaserc`](/Users/jaredjenkins/repos/aspenleafshelties.com/.firebaserc).

One-time login with Dockerized Firebase CLI:
`./scripts/firebase-login.sh`

Build and deploy Hosting:
`./scripts/firebase-deploy.sh`

Deploy to a preview channel:
`./scripts/firebase-preview.sh my-preview`

The Hosting config lives in [firebase.json](/Users/jaredjenkins/repos/aspenleafshelties.com/firebase.json) and is set up for an Angular SPA using `dist/aspenleafshelties` as the deploy directory.

Firebase Storage rules now live in [storage.rules](/Users/jaredjenkins/repos/aspenleafshelties.com/storage.rules). The current rule set is intentionally open as a temporary migration step so image uploads work while the site moves to the new bucket. `./scripts/firebase-deploy.sh` deploys both Hosting and Storage rules.

## Firestore Import

The live API Swagger has been saved to [docs/api/aspenleafapi.swagger.v1.json](/Users/jaredjenkins/repos/aspenleafshelties.com/docs/api/aspenleafapi.swagger.v1.json).

The target Firestore model is documented in [docs/firestore-model.md](/Users/jaredjenkins/repos/aspenleafshelties.com/docs/firestore-model.md).

Reset import flow:

1. Pick the target Firebase project ID you actually want to use.
2. Create Firestore in Native mode in that project.
3. Create a service account JSON for that same project.
4. Dry-run the importer.
5. Run the real import.

Preview the import without writing to Firestore:
`./scripts/import-live-api-to-firestore.sh /absolute/path/to/service-account.json your-project-id --dry-run`

Run the import:
`./scripts/import-live-api-to-firestore.sh /absolute/path/to/service-account.json your-project-id`

## Public Firestore Reads

The public read paths now use Firestore only. There is no runtime fallback to the legacy API.

To switch the frontend over, paste your Firebase web app config into:

- [src/environments/environment.ts](/Users/jaredjenkins/repos/aspenleafshelties.com/src/environments/environment.ts)
- [src/environments/environment.prod.ts](/Users/jaredjenkins/repos/aspenleafshelties.com/src/environments/environment.prod.ts)

Specifically, replace `firebase: null` with the config object from the Firebase console for project `aspenleafshelties`.
