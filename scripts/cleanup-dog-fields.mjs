import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import admin from 'firebase-admin';

const FIREBASE_TOOLS_CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const FIREBASE_TOOLS_CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

const REQUIRED_TEXT_FIELDS = new Set(['rname', 'cname']);
const OPTIONAL_TEXT_FIELDS = new Set([
  'comments',
  'sireName',
  'damName',
  'profileImageUrl',
  'profileCardImageUrl',
  'profileDetailImageUrl',
  'profileCardImagePath',
  'profileDetailImagePath',
]);
const OPTIONAL_GENERIC_FIELDS = new Set(['dob', 'sireId', 'damId', 'price', 'status']);

const args = process.argv.slice(2);

function getFlag(name, fallback = undefined) {
  const index = args.indexOf(name);
  if (index === -1) {
    return fallback;
  }

  return args[index + 1] ?? fallback;
}

function usage() {
  console.error(
    'Usage: node scripts/cleanup-dog-fields.mjs --project-id <firebase-project-id> [--apply] [--emulator-host <host:port>] [--firebase-tools-config <path>]',
  );
}

function chunk(values, size) {
  const chunks = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function normalizeRequiredText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeOptionalText(value) {
  const normalizedValue = normalizeRequiredText(value);
  return normalizedValue || null;
}

function formatValue(value) {
  if (value === undefined) {
    return '[missing]';
  }

  if (value === null) {
    return 'null';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return JSON.stringify(value);
}

function buildDogCleanup(dogData) {
  const changes = [];
  const setFields = {};
  const deleteFields = [];

  for (const field of REQUIRED_TEXT_FIELDS) {
    const currentValue = dogData[field];
    const nextValue = normalizeRequiredText(currentValue);
    const comparableCurrentValue = typeof currentValue === 'string' ? currentValue : '';

    if (comparableCurrentValue !== nextValue) {
      setFields[field] = nextValue;
      changes.push({
        field,
        from: currentValue,
        to: nextValue,
      });
    }
  }

  for (const field of OPTIONAL_TEXT_FIELDS) {
    if (!(field in dogData)) {
      continue;
    }

    const currentValue = dogData[field];
    const nextValue = normalizeOptionalText(currentValue);

    if (nextValue === null) {
      deleteFields.push(field);
      changes.push({
        field,
        from: currentValue,
        to: undefined,
      });
      continue;
    }

    if (currentValue !== nextValue) {
      setFields[field] = nextValue;
      changes.push({
        field,
        from: currentValue,
        to: nextValue,
      });
    }
  }

  for (const field of OPTIONAL_GENERIC_FIELDS) {
    if (!(field in dogData)) {
      continue;
    }

    const currentValue = dogData[field];
    if (currentValue !== null) {
      continue;
    }

    deleteFields.push(field);
    changes.push({
      field,
      from: currentValue,
      to: undefined,
    });
  }

  if (changes.length > 0) {
    setFields.updatedAt = new Date().toISOString();
  }

  return { changes, setFields, deleteFields };
}

function toFirestoreValue(value) {
  if (value === null) {
    return { nullValue: null };
  }

  if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }

  if (typeof value === 'string') {
    const isoDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value);
    return isoDate ? { timestampValue: value } : { stringValue: value };
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }

  if (typeof value === 'boolean') {
    return { booleanValue: value };
  }

  throw new Error(`Unsupported Firestore value: ${value}`);
}

function fromFirestoreValue(value) {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  if ('stringValue' in value) {
    return value.stringValue;
  }

  if ('nullValue' in value) {
    return null;
  }

  if ('timestampValue' in value) {
    return value.timestampValue;
  }

  if ('integerValue' in value) {
    const integerValue = Number(value.integerValue);
    return Number.isFinite(integerValue) ? integerValue : value.integerValue;
  }

  if ('doubleValue' in value) {
    return value.doubleValue;
  }

  if ('booleanValue' in value) {
    return value.booleanValue;
  }

  return undefined;
}

function buildDocumentBody(documentName, setFields) {
  return {
    name: documentName,
    fields: Object.fromEntries(Object.entries(setFields).map(([field, value]) => [field, toFirestoreValue(value)])),
  };
}

async function commitInBatches(db, operations) {
  for (const operationChunk of chunk(operations, 400)) {
    const batch = db.batch();
    for (const operation of operationChunk) {
      operation(batch);
    }

    await batch.commit();
  }
}

function resolveFirebaseToolsConfigPath() {
  const configuredPath = getFlag('--firebase-tools-config');
  if (configuredPath) {
    return configuredPath;
  }

  const cwdConfigPath = path.resolve(process.cwd(), '.firebase-config/firebase-tools.json');
  if (fs.existsSync(cwdConfigPath)) {
    return cwdConfigPath;
  }

  return path.join(os.homedir(), '.config/configstore/firebase-tools.json');
}

async function getFirebaseToolsAccessToken(firebaseToolsConfigPath) {
  if (!fs.existsSync(firebaseToolsConfigPath)) {
    throw new Error(`Firebase Tools auth config not found at ${firebaseToolsConfigPath}`);
  }

  const config = JSON.parse(fs.readFileSync(firebaseToolsConfigPath, 'utf8'));
  const refreshToken = config?.tokens?.refresh_token;

  if (!refreshToken) {
    throw new Error(`No refresh token found in ${firebaseToolsConfigPath}. Run firebase login again.`);
  }

  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: FIREBASE_TOOLS_CLIENT_ID,
    client_secret: FIREBASE_TOOLS_CLIENT_SECRET,
    grant_type: 'refresh_token',
  });

  const response = await fetch('https://www.googleapis.com/oauth2/v3/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const responseBody = await response.json().catch(() => ({}));
  if (!response.ok || typeof responseBody.access_token !== 'string') {
    throw new Error(`Unable to refresh Firebase CLI access token: ${response.status} ${JSON.stringify(responseBody)}`);
  }

  return responseBody.access_token;
}

async function fetchDogsViaRest(projectId, accessToken) {
  const documents = [];
  let nextPageToken = '';

  do {
    const pageTokenQuery = nextPageToken ? `&pageToken=${encodeURIComponent(nextPageToken)}` : '';
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/dogs?pageSize=500${pageTokenQuery}`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error(`Unable to fetch dogs from Firestore REST API: ${response.status} ${JSON.stringify(responseBody)}`);
    }

    for (const document of responseBody.documents ?? []) {
      documents.push({
        id: document.name.split('/').at(-1),
        name: document.name,
        data: Object.fromEntries(
          Object.entries(document.fields ?? {}).map(([field, value]) => [field, fromFirestoreValue(value)]),
        ),
      });
    }

    nextPageToken = responseBody.nextPageToken ?? '';
  } while (nextPageToken);

  return documents;
}

async function patchDogViaRest(projectId, accessToken, cleanup) {
  const updateMaskFields = [...new Set([...Object.keys(cleanup.setFields), ...cleanup.deleteFields])];
  const query = updateMaskFields.map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`).join('&');
  const documentName = `projects/${projectId}/databases/(default)/documents/dogs/${cleanup.id}`;
  const response = await fetch(`https://firestore.googleapis.com/v1/${documentName}?${query}`, {
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(buildDocumentBody(documentName, cleanup.setFields)),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(`Unable to patch dogs/${cleanup.id}: ${response.status} ${responseBody}`);
  }
}

function logCleanupSummary(dogCleanups) {
  const fieldCounts = new Map();
  for (const cleanup of dogCleanups) {
    for (const change of cleanup.changes) {
      fieldCounts.set(change.field, (fieldCounts.get(change.field) ?? 0) + 1);
    }
  }

  console.log(`Found ${dogCleanups.length} dog docs with cleanup changes.`);
  console.log('Field counts:');
  for (const [field, count] of [...fieldCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    console.log(`  ${field}: ${count}`);
  }

  console.log('Planned changes:');
  for (const cleanup of dogCleanups) {
    console.log(`- dogs/${cleanup.id}`);
    for (const change of cleanup.changes) {
      console.log(`    ${change.field}: ${formatValue(change.from)} -> ${formatValue(change.to)}`);
    }
  }
}

async function runWithAdminSdk({ projectId, emulatorHost, applyChanges }) {
  if (emulatorHost) {
    process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;
    console.log(`Using Firestore emulator at ${emulatorHost}`);
  }

  admin.initializeApp(
    emulatorHost
      ? { projectId }
      : {
          credential: admin.credential.applicationDefault(),
          projectId,
        },
  );

  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });

  const dogsSnapshot = await db.collection('dogs').get();
  const dogCleanups = dogsSnapshot.docs
    .map((snapshot) => {
      const { changes, setFields, deleteFields } = buildDogCleanup(snapshot.data());
      return {
        id: snapshot.id,
        ref: snapshot.ref,
        changes,
        setFields,
        deleteFields,
      };
    })
    .filter((entry) => entry.changes.length > 0);

  if (dogCleanups.length === 0) {
    console.log('No dog docs need cleanup.');
    return;
  }

  logCleanupSummary(dogCleanups);

  if (!applyChanges) {
    console.log('Dry run only. Re-run with --apply to write these changes.');
    return;
  }

  const operations = dogCleanups.map((cleanup) => (batch) => {
    const update = Object.fromEntries(Object.entries(cleanup.setFields));
    for (const field of cleanup.deleteFields) {
      update[field] = admin.firestore.FieldValue.delete();
    }

    batch.set(cleanup.ref, update, { merge: true });
  });

  await commitInBatches(db, operations);
  console.log(`Cleanup complete. Updated ${dogCleanups.length} dog docs.`);
}

async function runWithFirebaseToolsAuth({ projectId, applyChanges, firebaseToolsConfigPath }) {
  console.log(`Using Firebase Tools login from ${firebaseToolsConfigPath}`);
  const accessToken = await getFirebaseToolsAccessToken(firebaseToolsConfigPath);
  const dogs = await fetchDogsViaRest(projectId, accessToken);
  const dogCleanups = dogs
    .map((dog) => {
      const { changes, setFields, deleteFields } = buildDogCleanup(dog.data);
      return {
        id: dog.id,
        changes,
        setFields,
        deleteFields,
      };
    })
    .filter((entry) => entry.changes.length > 0);

  if (dogCleanups.length === 0) {
    console.log('No dog docs need cleanup.');
    return;
  }

  logCleanupSummary(dogCleanups);

  if (!applyChanges) {
    console.log('Dry run only. Re-run with --apply to write these changes.');
    return;
  }

  for (const cleanup of dogCleanups) {
    await patchDogViaRest(projectId, accessToken, cleanup);
  }

  console.log(`Cleanup complete. Updated ${dogCleanups.length} dog docs.`);
}

async function main() {
  const applyChanges = args.includes('--apply');
  const projectId = getFlag('--project-id', process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT);
  const emulatorHost = getFlag('--emulator-host', process.env.FIRESTORE_EMULATOR_HOST);
  const firebaseToolsConfigPath = getFlag('--firebase-tools-config', resolveFirebaseToolsConfigPath());

  if (!projectId) {
    usage();
    process.exit(1);
  }

  if (emulatorHost || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    await runWithAdminSdk({ projectId, emulatorHost, applyChanges });
    return;
  }

  await runWithFirebaseToolsAuth({ projectId, applyChanges, firebaseToolsConfigPath });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
