import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import process from 'node:process';

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { Storage } from '@google-cloud/storage';

function usage() {
  console.error(
    'Usage: node scripts/migrate-storage-images.mjs <old-service-account.json> <new-service-account.json> <old-bucket> <new-bucket> [--dry-run]',
  );
}

function buildDownloadUrl(bucketName, objectName, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectName)}?alt=media&token=${token}`;
}

function extractFirebaseStorageObject(urlString, knownBuckets) {
  if (!urlString) {
    return null;
  }

  try {
    const url = new URL(urlString);
    if (url.hostname !== 'firebasestorage.googleapis.com') {
      return null;
    }

    const pathMatch = url.pathname.match(/^\/v0\/b\/([^/]+)\/o\/(.+)$/);
    if (!pathMatch) {
      return null;
    }

    const bucketName = decodeURIComponent(pathMatch[1]);
    const objectName = decodeURIComponent(pathMatch[2]);
    if (!knownBuckets.has(bucketName)) {
      return null;
    }

    return { bucketName, objectName };
  } catch {
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const positionalArgs = args.filter((arg) => arg !== '--dry-run');

  if (positionalArgs.length !== 4) {
    usage();
    process.exit(1);
  }

  const [oldKeyPath, newKeyPath, oldBucketName, newBucketName] = positionalArgs;

  const oldStorage = new Storage({ keyFilename: oldKeyPath });
  const newStorage = new Storage({ keyFilename: newKeyPath });
  const oldBucket = oldStorage.bucket(oldBucketName);
  const newBucket = newStorage.bucket(newBucketName);

  const [files] = await oldBucket.getFiles();
  console.log(`Found ${files.length} objects in gs://${oldBucketName}`);

  const objectUrlMap = new Map();
  let copiedCount = 0;

  for (const file of files) {
    const objectName = file.name;
    const token = randomUUID();
    const newUrl = buildDownloadUrl(newBucketName, objectName, token);
    objectUrlMap.set(objectName, newUrl);

    if (dryRun) {
      console.log(`[dry-run] would copy gs://${oldBucketName}/${objectName} -> gs://${newBucketName}/${objectName}`);
      copiedCount += 1;
      continue;
    }

    const destinationFile = newBucket.file(objectName);
    const [sourceMetadata] = await file.getMetadata();
    const [contents] = await file.download();
    await destinationFile.save(contents, {
      metadata: {
        contentType: sourceMetadata.contentType,
        cacheControl: sourceMetadata.cacheControl,
        metadata: {
          ...sourceMetadata.metadata,
          firebaseStorageDownloadTokens: token,
        },
      },
    });
    copiedCount += 1;
    console.log(`Copied gs://${oldBucketName}/${objectName} -> gs://${newBucketName}/${objectName}`);
  }

  const serviceAccountValue = JSON.parse(await readFile(newKeyPath, 'utf8'));

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccountValue),
        projectId: serviceAccountValue.project_id,
        storageBucket: newBucketName,
      });
  const firestore = getFirestore(app);

  const dogsSnapshot = await firestore.collection('dogs').get();
  const knownBuckets = new Set([oldBucketName, newBucketName]);
  let updatedDogCount = 0;
  let unchangedDogCount = 0;

  for (const dogDoc of dogsSnapshot.docs) {
    const profileImageUrl = dogDoc.get('profileImageUrl');
    const parsed = extractFirebaseStorageObject(profileImageUrl, knownBuckets);

    if (!parsed) {
      unchangedDogCount += 1;
      continue;
    }

    const replacementUrl = objectUrlMap.get(parsed.objectName);
    if (!replacementUrl || replacementUrl === profileImageUrl) {
      unchangedDogCount += 1;
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] would update dogs/${dogDoc.id} profileImageUrl -> ${replacementUrl}`);
      updatedDogCount += 1;
      continue;
    }

    await dogDoc.ref.update({
      profileImageUrl: replacementUrl,
      updatedAt: FieldValue.serverTimestamp(),
    });
    updatedDogCount += 1;
    console.log(`Updated dogs/${dogDoc.id} profileImageUrl`);
  }

  console.log(
    `${dryRun ? 'Dry run complete' : 'Migration complete'}: copied ${copiedCount} objects, updated ${updatedDogCount} dogs, left ${unchangedDogCount} dogs unchanged.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
