import { randomUUID } from 'node:crypto';
import process from 'node:process';

import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';

const PROD_BUCKET = 'aspenleafshelties.appspot.com';
const EMULATOR_PROJECT_ID = 'demo-aspenleafshelties';
const EMULATOR_BUCKET = 'demo-aspenleafshelties.appspot.com';
const EMULATOR_FIRESTORE_HOST = 'host.docker.internal:8080';
const EMULATOR_STORAGE_API = 'http://host.docker.internal:9199';
const LOCAL_STORAGE_PUBLIC_HOST = 'http://127.0.0.1:9199';

function usage() {
  console.error('Usage: node scripts/seed-prod-to-emulators.mjs <prod-service-account.json> [--dry-run]');
}

function buildEmulatorDownloadUrl(objectName, token) {
  return `${LOCAL_STORAGE_PUBLIC_HOST}/v0/b/${EMULATOR_BUCKET}/o/${encodeURIComponent(objectName)}?alt=media&token=${token}`;
}

function parseProdStorageObject(urlString) {
  if (!urlString) {
    return null;
  }

  try {
    const url = new URL(urlString);
    if (url.hostname !== 'firebasestorage.googleapis.com') {
      return null;
    }

    const match = url.pathname.match(/^\/v0\/b\/([^/]+)\/o\/(.+)$/);
    if (!match) {
      return null;
    }

    const bucketName = decodeURIComponent(match[1]);
    const objectName = decodeURIComponent(match[2]);
    if (bucketName !== PROD_BUCKET) {
      return null;
    }

    return { bucketName, objectName };
  } catch {
    return null;
  }
}

async function replaceCollection(targetCollection, sourceSnapshots, dryRun) {
  const existingDocs = await targetCollection.listDocuments();
  for (const docRef of existingDocs) {
    if (dryRun) {
      console.log(`[dry-run] would delete ${docRef.path}`);
      continue;
    }

    await docRef.delete();
  }

  for (const sourceDoc of sourceSnapshots) {
    if (dryRun) {
      console.log(`[dry-run] would write ${targetCollection.path}/${sourceDoc.id}`);
      continue;
    }

    await targetCollection.doc(sourceDoc.id).set(sourceDoc.data());
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const positionalArgs = args.filter((arg) => arg !== '--dry-run');

  if (positionalArgs.length !== 1) {
    usage();
    process.exit(1);
  }

  const [prodServiceAccountPath] = positionalArgs;

  const prodFirestore = new Firestore({
    keyFilename: prodServiceAccountPath,
  });

  const prodStorage = new Storage({
    keyFilename: prodServiceAccountPath,
  });

  process.env.FIRESTORE_EMULATOR_HOST = EMULATOR_FIRESTORE_HOST;
  const emulatorFirestore = new Firestore({
    projectId: EMULATOR_PROJECT_ID,
  });

  const emulatorStorage = new Storage({
    apiEndpoint: EMULATOR_STORAGE_API,
    projectId: EMULATOR_PROJECT_ID,
  });

  const prodDogsSnapshot = await prodFirestore.collection('dogs').get();
  const prodPagesSnapshot = await prodFirestore.collection('pages').get();

  console.log(`Fetched ${prodDogsSnapshot.size} prod dogs`);
  console.log(`Fetched ${prodPagesSnapshot.size} prod pages`);

  const emulatorDogCollection = emulatorFirestore.collection('dogs');
  const emulatorPageCollection = emulatorFirestore.collection('pages');

  await replaceCollection(emulatorPageCollection, prodPagesSnapshot.docs, dryRun);

  const prodBucket = prodStorage.bucket(PROD_BUCKET);
  const emulatorBucket = emulatorStorage.bucket(EMULATOR_BUCKET);

  let copiedImageCount = 0;
  let rewrittenImageCount = 0;
  let unchangedImageCount = 0;

  const existingDogDocs = await emulatorDogCollection.listDocuments();
  for (const docRef of existingDogDocs) {
    if (dryRun) {
      console.log(`[dry-run] would delete ${docRef.path}`);
      continue;
    }

    await docRef.delete();
  }

  for (const dogDoc of prodDogsSnapshot.docs) {
    const data = dogDoc.data();
    const profileImageUrl = data.profileImageUrl ?? null;
    const prodStorageObject = parseProdStorageObject(profileImageUrl);

    if (prodStorageObject) {
      const sourceFile = prodBucket.file(prodStorageObject.objectName);
      const destinationFile = emulatorBucket.file(prodStorageObject.objectName);
      const token = randomUUID();

      if (dryRun) {
        console.log(
          `[dry-run] would copy image gs://${PROD_BUCKET}/${prodStorageObject.objectName} -> emulator bucket ${EMULATOR_BUCKET}`,
        );
      } else {
        const [metadata] = await sourceFile.getMetadata();
        const [contents] = await sourceFile.download();
        await destinationFile.save(contents, {
          metadata: {
            contentType: metadata.contentType,
            cacheControl: metadata.cacheControl,
            metadata: {
              ...metadata.metadata,
              firebaseStorageDownloadTokens: token,
            },
          },
        });
      }

      data.profileImageUrl = buildEmulatorDownloadUrl(prodStorageObject.objectName, token);
      copiedImageCount += 1;
      rewrittenImageCount += 1;
    } else {
      unchangedImageCount += 1;
    }

    if (dryRun) {
      console.log(`[dry-run] would write dogs/${dogDoc.id}`);
      continue;
    }

    await emulatorDogCollection.doc(dogDoc.id).set(data);
  }

  console.log(
    `${dryRun ? 'Dry run complete' : 'Seed complete'}: wrote ${prodDogsSnapshot.size} dogs, ${prodPagesSnapshot.size} pages, copied ${copiedImageCount} bucket-backed images, rewrote ${rewrittenImageCount} dog image URLs, left ${unchangedImageCount} image URLs unchanged.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
