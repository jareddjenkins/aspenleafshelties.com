import admin from 'firebase-admin';

const args = process.argv.slice(2);

function getFlag(name, fallback = undefined) {
  const index = args.indexOf(name);
  if (index === -1) {
    return fallback;
  }

  return args[index + 1] ?? fallback;
}

function usage() {
  console.error('Usage: node scripts/migrate-dog-doc-ids.mjs --project-id <firebase-project-id> [--dry-run] [--emulator-host <host:port>]');
}

function chunk(values, size) {
  const chunks = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function isLegacyDogId(value) {
  return /^\d+$/.test(value);
}

function normalizeReferenceId(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return String(value);
}

function rewriteDogReference(value, idMap) {
  const normalizedValue = normalizeReferenceId(value);
  if (!normalizedValue) {
    return null;
  }

  return idMap.get(normalizedValue) ?? normalizedValue;
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

async function main() {
  const dryRun = args.includes('--dry-run');
  const projectId = getFlag('--project-id', process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT);
  const emulatorHost = getFlag('--emulator-host', process.env.FIRESTORE_EMULATOR_HOST);

  if (!projectId) {
    usage();
    process.exit(1);
  }

  if (emulatorHost) {
    process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;
    console.log(`Using Firestore emulator at ${emulatorHost}`);
  } else if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('Missing GOOGLE_APPLICATION_CREDENTIALS. Point it at a Firebase service account JSON file.');
    process.exit(1);
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

  const [dogsSnapshot, pagesSnapshot] = await Promise.all([
    db.collection('dogs').get(),
    db.collection('pages').get(),
  ]);

  const dogDocs = dogsSnapshot.docs.map((snapshot) => ({
    id: snapshot.id,
    ref: snapshot.ref,
    data: snapshot.data(),
  }));
  const legacyDogs = dogDocs.filter((dog) => isLegacyDogId(dog.id));

  if (legacyDogs.length === 0) {
    console.log('No legacy numeric dog IDs found. Nothing to migrate.');
    return;
  }

  const idMap = new Map();
  for (const dog of legacyDogs) {
    idMap.set(dog.id, db.collection('dogs').doc().id);
  }

  const knownDogIds = new Set(dogDocs.map((dog) => dog.id));
  const pageReferences = pagesSnapshot.docs.flatMap((snapshot) => (snapshot.data().dogIds ?? []).map((dogId) => ({
    source: `pages/${snapshot.id}`,
    dogId: normalizeReferenceId(dogId),
  })));
  const pedigreeReferences = dogDocs.flatMap((dog) => [
    { source: `dogs/${dog.id}.sireId`, dogId: normalizeReferenceId(dog.data.sireId ?? null) },
    { source: `dogs/${dog.id}.damId`, dogId: normalizeReferenceId(dog.data.damId ?? null) },
  ]);
  const missingReferences = [...pageReferences, ...pedigreeReferences]
    .filter((reference) => reference.dogId && !knownDogIds.has(reference.dogId))
    .map((reference) => `${reference.source} -> ${reference.dogId}`);

  console.log(`Found ${dogDocs.length} total dog docs.`);
  console.log(`Found ${legacyDogs.length} dog docs with legacy numeric IDs to migrate.`);
  console.log(`Found ${pagesSnapshot.size} page docs to inspect.`);

  if (missingReferences.length > 0) {
    console.warn('Found references that do not match an existing dog doc:');
    for (const reference of missingReferences) {
      console.warn(`  - ${reference}`);
    }
  }

  console.log('Planned dog ID rewrites:');
  for (const [oldId, newId] of idMap.entries()) {
    console.log(`  ${oldId} -> ${newId}`);
  }

  if (dryRun) {
    console.log('Dry run only. No Firestore writes were made.');
    return;
  }

  const createDogOperations = legacyDogs.map((dog) => {
    const newId = idMap.get(dog.id);
    const nextData = {
      ...dog.data,
      sireId: rewriteDogReference(dog.data.sireId ?? null, idMap),
      damId: rewriteDogReference(dog.data.damId ?? null, idMap),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    delete nextData.legacyId;

    return (batch) => {
      batch.set(
        db.collection('dogs').doc(newId),
        nextData,
        { merge: false },
      );
    };
  });

  const updateExistingDogOperations = dogDocs
    .filter((dog) => !idMap.has(dog.id))
    .map((dog) => {
      const sireId = rewriteDogReference(dog.data.sireId ?? null, idMap);
      const damId = rewriteDogReference(dog.data.damId ?? null, idMap);
      const changed =
        sireId !== normalizeReferenceId(dog.data.sireId ?? null) ||
        damId !== normalizeReferenceId(dog.data.damId ?? null);

      if (!changed) {
        return null;
      }

      return (batch) => {
        batch.set(
          dog.ref,
          {
            sireId,
            damId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      };
    })
    .filter(Boolean);

  const updatePageOperations = pagesSnapshot.docs.map((pageSnapshot) => {
    const pageData = pageSnapshot.data();
    const nextDogIds = (pageData.dogIds ?? []).map((dogId) => {
      const normalizedDogId = normalizeReferenceId(dogId);
      return normalizedDogId ? (idMap.get(normalizedDogId) ?? normalizedDogId) : normalizedDogId;
    });

    return (batch) => {
      batch.set(
        pageSnapshot.ref,
        {
          dogIds: nextDogIds,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    };
  });

  const metadataRef = db.collection('migrationMetadata').doc(`dogIdMigration_${Date.now()}`);
  const metadataOperation = (batch) => {
    batch.set(metadataRef, {
      migratedAt: admin.firestore.FieldValue.serverTimestamp(),
      migratedDogCount: legacyDogs.length,
      pageCount: pagesSnapshot.size,
      mappings: Array.from(idMap.entries()).map(([oldId, newId]) => ({ oldId, newId })),
      missingReferences,
    });
  };

  const deleteLegacyDogOperations = legacyDogs.map((dog) => (batch) => {
    batch.delete(dog.ref);
  });

  await commitInBatches(db, createDogOperations);
  await commitInBatches(db, updateExistingDogOperations);
  await commitInBatches(db, updatePageOperations);
  await commitInBatches(db, [metadataOperation]);
  await commitInBatches(db, deleteLegacyDogOperations);

  console.log(`Migration complete. Metadata written to ${metadataRef.path}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
