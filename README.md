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

That local dev flow now uses Firebase emulators, not production. The emulator ports are:
- Firestore: `http://localhost:8080`
- Storage: `http://localhost:9199`
- Emulator UI: `http://localhost:4000`

Local emulator data is persisted in `.firebase/emulator-data`. The emulator container imports from that directory on startup, and the down scripts run an explicit `firebase emulators:export` before stopping the emulator.

If you only want the emulators without the Angular dev server:
`./scripts/firebase-emulators-up.sh`

Stop either workflow with:
`./scripts/docker-prod-down.sh`
or
`./scripts/docker-dev-down.sh`
or
`./scripts/firebase-emulators-down.sh`

If you do have npm installed, the equivalent shortcuts in `package.json` still work too.

`environment.ts` is now intentionally pointed at a local-only demo Firebase project and connects to the Firestore and Storage emulators. `environment.prod.ts` remains pointed at the live `aspenleafshelties` project.

To seed the local emulators from production data:
`./scripts/seed-prod-to-emulators.sh /absolute/path/to/prod-service-account.json`

Preview the seed without writing:
`./scripts/seed-prod-to-emulators.sh /absolute/path/to/prod-service-account.json --dry-run`

The seed copies `dogs` and `pages` from production Firestore into the local emulator, mirrors bucket-backed profile images into the local Storage emulator, and rewrites those local image URLs to `127.0.0.1:9199`. Local uploads remain emulator-only and do not write back to production.

## Firebase Hosting

The Firebase project is set to `aspenleafshelties` in [`.firebaserc`](/Users/jaredjenkins/repos/aspenleafshelties.com/.firebaserc).

One-time login with Dockerized Firebase CLI:
`./scripts/firebase-login.sh`

Build and deploy Hosting:
`./scripts/firebase-deploy.sh`

Deploy to a preview channel:
`./scripts/firebase-preview.sh my-preview`

GitHub Actions deploys automatically on pushes to `main`. The repo includes Terraform for Google OIDC in [infra/terraform/github-oidc/README.md](/Users/jaredjenkins/repos/aspenleafshelties.com/infra/terraform/github-oidc/README.md), but the current workflow uses the temporary secret `FIREBASE_SERVICE_ACCOUNT_ASPENLEAFSHELTIES` because `firebase-tools` deploy has been more reliable with a service-account key than WIF here. Remove that secret-based auth and switch the workflow back to OIDC when the Firebase CLI path is stable.

The GitHub Actions workflow also pins `firebase-tools` to a known-stable CI version for now because newer CLI builds have been unreliable with service-account-based Storage deploy checks. CI currently deploys only Hosting and Firestore. Deploy Storage rules manually when needed until that path is stable again.

Hosting now deploys the prerendered Angular output from `dist/aspenleafshelties/browser`. The deploy scripts and GitHub Actions build that bundle with `npm run build:hosting`, which currently maps to `npm run prerender`.

Firebase Storage rules now live in [storage.rules](/Users/jaredjenkins/repos/aspenleafshelties.com/storage.rules). The current rule set is intentionally open as a temporary migration step so image uploads work while the site moves to the new bucket. `./scripts/firebase-deploy.sh` deploys Hosting, Storage rules, and Firestore rules.

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

[src/environments/environment.ts](/Users/jaredjenkins/repos/aspenleafshelties.com/src/environments/environment.ts) is for local emulator-backed development.
[src/environments/environment.prod.ts](/Users/jaredjenkins/repos/aspenleafshelties.com/src/environments/environment.prod.ts) is for the live `aspenleafshelties` project.
