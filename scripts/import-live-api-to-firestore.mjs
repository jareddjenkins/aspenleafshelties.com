import admin from 'firebase-admin';

const DEFAULT_API_BASE = 'https://aspenleafapi.azurewebsites.net/api';
const args = process.argv.slice(2);

function getFlag(name, fallback = undefined) {
  const index = args.indexOf(name);
  if (index === -1) {
    return fallback;
  }

  return args[index + 1] ?? fallback;
}

const dryRun = args.includes('--dry-run');
const projectId = getFlag('--project-id', process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT);
const apiBase = getFlag('--api-base', DEFAULT_API_BASE).replace(/\/$/, '');

if (!projectId) {
  console.error('Missing Firebase project ID. Use --project-id or FIREBASE_PROJECT_ID.');
  process.exit(1);
}

if (!dryRun && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Missing GOOGLE_APPLICATION_CREDENTIALS. Point it at a Firebase service account JSON file.');
  process.exit(1);
}

let db = null;

if (!dryRun) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });

  db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
}

function slugifyPageName(value) {
  return value.trim().toLowerCase();
}

function normalizeDog(dog) {
  return {
    legacyId: dog.id,
    rname: dog.rname ?? null,
    cname: dog.cname ?? null,
    comments: dog.comments ?? '',
    dob: dog.dob ? admin.firestore.Timestamp.fromDate(new Date(dog.dob)) : null,
    gender: dog.gender ?? null,
    sireId: dog.sireId ?? null,
    sireName: dog.sireName ?? null,
    damId: dog.damId ?? null,
    damName: dog.damName ?? null,
    profileImageUrl: dog.profileImageUrl ?? null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

function buildPages(dogPages) {
  const grouped = new Map();

  for (const entry of dogPages) {
    const slug = slugifyPageName(entry.pageName);
    if (!grouped.has(slug)) {
      grouped.set(slug, {
        slug,
        displayName: entry.pageName,
        legacyPageName: entry.pageName,
        dogIds: [],
      });
    }

    grouped.get(slug).dogIds.push({
      dogId: String(entry.dogsId),
      sortId: entry.sortId,
    });
  }

  return Array.from(grouped.values()).map((page) => ({
    ...page,
    dogIds: page.dogIds
      .sort((a, b) => a.sortId - b.sortId)
      .map((entry) => entry.dogId),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }));
}

async function fetchJson(path) {
  const response = await fetch(`${apiBase}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  const [dogs, dogPages] = await Promise.all([
    fetchJson('/dogs'),
    fetchJson('/dogpages'),
  ]);

  const pages = buildPages(dogPages);

  console.log(`Fetched ${dogs.length} dogs from ${apiBase}/dogs`);
  console.log(`Fetched ${dogPages.length} dog page rows from ${apiBase}/dogpages`);
  console.log(`Derived ${pages.length} page documents: ${pages.map((page) => page.slug).join(', ')}`);

  if (dryRun) {
    console.log('Dry run only. No Firestore writes were made.');
    return;
  }

  const dogChunks = [];
  for (let i = 0; i < dogs.length; i += 400) {
    dogChunks.push(dogs.slice(i, i + 400));
  }

  for (const chunk of dogChunks) {
    const batch = db.batch();

    for (const dog of chunk) {
      const docRef = db.collection('dogs').doc(String(dog.id));
      batch.set(
        docRef,
        {
          ...normalizeDog(dog),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    await batch.commit();
  }

  {
    const batch = db.batch();
    for (const page of pages) {
      const docRef = db.collection('pages').doc(page.slug);
      batch.set(docRef, page, { merge: true });
    }
    await batch.commit();
  }

  await db.collection('migrationMetadata').doc('liveApiImport').set(
    {
      sourceApiBase: apiBase,
      importedDogs: dogs.length,
      importedDogPageRows: dogPages.length,
      importedPages: pages.length,
      lastImportedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(`Imported ${dogs.length} dogs and ${pages.length} pages into Firestore project ${projectId}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
