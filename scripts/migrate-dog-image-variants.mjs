import { randomUUID } from 'node:crypto';
import process from 'node:process';

import admin from 'firebase-admin';
import sharp from 'sharp';

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
    'Usage: node scripts/migrate-dog-image-variants.mjs --project-id <firebase-project-id> [--bucket <storage-bucket>] [--dry-run] [--emulator-host <host:port>] [--delete-legacy]',
  );
}

function buildDownloadUrl(bucketName, objectName, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectName)}?alt=media&token=${token}`;
}

function extractFirebaseStorageObject(urlString, bucketName) {
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

    const urlBucketName = decodeURIComponent(pathMatch[1]);
    if (urlBucketName !== bucketName) {
      return null;
    }

    return decodeURIComponent(pathMatch[2]);
  } catch {
    return null;
  }
}

async function uploadVariant(bucket, objectName, contents, contentType) {
  const token = randomUUID();
  const file = bucket.file(objectName);

  await file.save(contents, {
    resumable: false,
    metadata: {
      contentType,
      cacheControl: 'public,max-age=31536000,immutable',
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  return {
    path: objectName,
    url: buildDownloadUrl(bucket.name, objectName, token),
  };
}

async function main() {
  const dryRun = args.includes('--dry-run');
  const deleteLegacy = args.includes('--delete-legacy');
  const projectId = getFlag('--project-id', process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT);
  const bucketName = getFlag('--bucket', process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`);
  const emulatorHost = getFlag('--emulator-host', process.env.FIRESTORE_EMULATOR_HOST);

  if (!projectId || !bucketName) {
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
          storageBucket: bucketName,
        },
  );

  const db = admin.firestore();
  const bucket = admin.storage().bucket(bucketName);

  const dogsSnapshot = await db.collection('dogs').get();
  console.log(`Found ${dogsSnapshot.size} dogs to inspect.`);

  let migratedCount = 0;
  let skippedCount = 0;

  for (const dogSnapshot of dogsSnapshot.docs) {
    const dogData = dogSnapshot.data();
    const existingCardUrl = dogData.profileCardImageUrl ?? null;
    const existingDetailUrl = dogData.profileDetailImageUrl ?? null;

    if (existingCardUrl && existingDetailUrl) {
      skippedCount += 1;
      continue;
    }

    const sourcePath =
      dogData.profileDetailImagePath ??
      dogData.profileCardImagePath ??
      extractFirebaseStorageObject(dogData.profileImageUrl ?? null, bucket.name);

    if (!sourcePath) {
      skippedCount += 1;
      console.warn(`Skipping dogs/${dogSnapshot.id}; no Firebase Storage source image could be determined.`);
      continue;
    }

    const sourceFile = bucket.file(sourcePath);
    const [exists] = await sourceFile.exists();
    if (!exists) {
      skippedCount += 1;
      console.warn(`Skipping dogs/${dogSnapshot.id}; source object does not exist: gs://${bucket.name}/${sourcePath}`);
      continue;
    }

    const cardPath = `dogs/${dogSnapshot.id}/card.jpg`;
    const detailPath = `dogs/${dogSnapshot.id}/detail.jpg`;

    if (dryRun) {
      console.log(
        `[dry-run] would generate ${cardPath} and ${detailPath} from gs://${bucket.name}/${sourcePath} for dogs/${dogSnapshot.id}`,
      );
      migratedCount += 1;
      continue;
    }

    const [sourceContents] = await sourceFile.download();
    const [cardBuffer, detailBuffer] = await Promise.all([
      sharp(sourceContents)
        .rotate()
        .resize(640, 640, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: 84, mozjpeg: true })
        .toBuffer(),
      sharp(sourceContents)
        .rotate()
        .resize(1400, 1400, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: 84, mozjpeg: true })
        .toBuffer(),
    ]);

    const [cardUpload, detailUpload] = await Promise.all([
      uploadVariant(bucket, cardPath, cardBuffer, 'image/jpeg'),
      uploadVariant(bucket, detailPath, detailBuffer, 'image/jpeg'),
    ]);

    await dogSnapshot.ref.set(
      {
        profileImageUrl: detailUpload.url,
        profileCardImageUrl: cardUpload.url,
        profileDetailImageUrl: detailUpload.url,
        profileCardImagePath: cardUpload.path,
        profileDetailImagePath: detailUpload.path,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    if (deleteLegacy && sourcePath.startsWith('profile/testimages/') && sourcePath !== cardPath && sourcePath !== detailPath) {
      await sourceFile.delete({ ignoreNotFound: true });
    }

    migratedCount += 1;
    console.log(`Migrated images for dogs/${dogSnapshot.id}`);
  }

  console.log(
    `${dryRun ? 'Dry run complete' : 'Migration complete'}: migrated ${migratedCount} dogs, skipped ${skippedCount} dogs.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
