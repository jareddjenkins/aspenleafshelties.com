import { Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { from, Observable, throwError } from 'rxjs';

import { Dog } from '../dogs/model/dog';
import { DogPageDocument, PageAssignment } from '../pages';
import { FirebaseAdminClientService } from './firebase-admin-client.service';

type FirestoreDogPayload = {
  rname: string;
  cname: string;
  comments: string;
  dob: Date | null;
  gender: number;
  sireId: string | null;
  sireName: string | null;
  damId: string | null;
  damName: string | null;
  profileImageUrl: string | null;
  profileCardImageUrl: string | null;
  profileDetailImageUrl: string | null;
  profileCardImagePath: string | null;
  profileDetailImagePath: string | null;
  status: 'reserved' | 'sold' | null;
  updatedAt: unknown;
  createdAt?: unknown;
};

type UploadedDogImages = {
  cardUrl: string;
  detailUrl: string;
  cardPath: string;
  detailPath: string;
};

@Injectable()
export class FirestoreAdminDataService {
  constructor(private firebaseAdminClientService: FirebaseAdminClientService) {}

  addDog(): Observable<Dog> {
    return from(this.createDog());
  }

  updateDog(dog: Dog): Observable<Dog> {
    return from(this.saveDog(dog));
  }

  uploadDogImage(id: string, images: { card: Blob; detail: Blob }): Observable<UploadedDogImages> {
    return from(this.uploadProfileImage(id, images));
  }

  putPagesByPage(pageName: string, updatedPages: PageAssignment[]): Observable<void> {
    return from(this.savePage(pageName, updatedPages));
  }

  deleteFromPagesById(pageName: string, id: string): Observable<void> {
    return from(this.removeDogFromPage(pageName, id));
  }

  deleteDog(id: string): Observable<void> {
    return from(this.removeDog(id));
  }

  private async createDog(): Promise<Dog> {
    const firestore = this.requireFirestore();
    const dogRef = doc(collection(firestore, 'dogs'));
    const dog: Dog = {
      id: dogRef.id,
      rname: '',
      cname: '',
      comments: '',
      dob: null,
      damId: null,
      damName: '',
      sireId: null,
      sireName: '',
      gender: 0 as unknown as boolean,
      profileImageUrl: '',
      profileCardImageUrl: '',
      profileDetailImageUrl: '',
      profileCardImagePath: null,
      profileDetailImagePath: null,
      status: null,
    };

    await setDoc(dogRef, this.toDogPayload(dog, true));
    return dog;
  }

  private async saveDog(dog: Dog): Promise<Dog> {
    const firestore = this.requireFirestore();
    await setDoc(doc(firestore, 'dogs', dog.id), this.toDogPayload(dog), {
      merge: true,
    });
    return dog;
  }

  private async uploadProfileImage(id: string, images: { card: Blob; detail: Blob }): Promise<UploadedDogImages> {
    const storage = this.requireStorage();
    const firestore = this.requireFirestore();
    const cardPath = `dogs/${id}/card.jpg`;
    const detailPath = `dogs/${id}/detail.jpg`;
    const cardRef = ref(storage, cardPath);
    const detailRef = ref(storage, detailPath);

    await Promise.all([
      uploadBytes(cardRef, images.card, {
        contentType: images.card.type || 'image/jpeg',
        cacheControl: 'public,max-age=31536000,immutable',
      }),
      uploadBytes(detailRef, images.detail, {
        contentType: images.detail.type || 'image/jpeg',
        cacheControl: 'public,max-age=31536000,immutable',
      }),
    ]);

    const [cardUrl, detailUrl] = await Promise.all([getDownloadURL(cardRef), getDownloadURL(detailRef)]);
    await updateDoc(doc(firestore, 'dogs', id), {
      profileImageUrl: detailUrl,
      profileCardImageUrl: cardUrl,
      profileDetailImageUrl: detailUrl,
      profileCardImagePath: cardPath,
      profileDetailImagePath: detailPath,
      updatedAt: serverTimestamp(),
    });

    return {
      cardUrl,
      detailUrl,
      cardPath,
      detailPath,
    };
  }

  private async savePage(pageName: string, updatedPages: PageAssignment[]): Promise<void> {
    const firestore = this.requireFirestore();
    const slug = this.slugifyPageName(pageName);
    const pageRef = doc(firestore, 'pages', slug);
    const pageDocument: DogPageDocument = {
      slug,
      displayName: pageName,
      legacyPageName: pageName,
      dogIds: updatedPages
        .slice()
        .sort((a, b) => a.sortId - b.sortId)
        .map((page) => page.dogId),
    };

    await setDoc(
      pageRef,
      {
        ...pageDocument,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  private async removeDogFromPage(pageName: string, id: string): Promise<void> {
    const firestore = this.requireFirestore();
    const slug = this.slugifyPageName(pageName);
    const pageRef = doc(firestore, 'pages', slug);
    const pageSnapshot = await getDoc(pageRef);

    if (!pageSnapshot.exists()) {
      return;
    }

    const data = pageSnapshot.data() as { dogIds?: string[]; displayName?: string; legacyPageName?: string };
    const dogIds = (data.dogIds ?? []).filter((dogId) => dogId !== id);

    await setDoc(
      pageRef,
      {
        slug,
        displayName: data.displayName ?? pageName,
        legacyPageName: data.legacyPageName ?? pageName,
        dogIds,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  private async removeDog(id: string): Promise<void> {
    const firestore = this.requireFirestore();
    const storage = this.requireStorage();
    const pageSnapshots = await getDocs(collection(firestore, 'pages'));
    const blockingPages = pageSnapshots.docs
      .filter((snapshot) => {
        const data = snapshot.data() as { dogIds?: string[] };
        return (data.dogIds ?? []).includes(id);
      })
      .map((snapshot) => snapshot.id);

    if (blockingPages.length > 0) {
      throw new Error(`This dog cannot be deleted because it is still on these pages: ${blockingPages.join(', ')}.`);
    }

    const dogSnapshot = await getDoc(doc(firestore, 'dogs', id));
    if (dogSnapshot.exists()) {
      const dogData = dogSnapshot.data() as Partial<Dog>;
      const imagePaths = [
        dogData.profileCardImagePath,
        dogData.profileDetailImagePath,
        this.extractStoragePathFromUrl(dogData.profileCardImageUrl),
        this.extractStoragePathFromUrl(dogData.profileDetailImageUrl),
        this.extractStoragePathFromUrl(dogData.profileImageUrl),
      ].filter((path): path is string => Boolean(path));

      const uniqueImagePaths = [...new Set(imagePaths)];
      await Promise.all(
        uniqueImagePaths.map(async (path) => {
          try {
            await deleteObject(ref(storage, path));
          } catch (error) {
            if (!this.isStorageObjectMissingError(error)) {
              throw error;
            }
          }
        }),
      );
    }

    await deleteDoc(doc(firestore, 'dogs', id));
  }

  private toDogPayload(dog: Dog, includeCreatedAt = false): FirestoreDogPayload {
    const payload: FirestoreDogPayload = {
      rname: dog.rname ?? '',
      cname: dog.cname ?? '',
      comments: dog.comments ?? '',
      dob: dog.dob ? new Date(dog.dob) : null,
      gender: Number(dog.gender ?? 0),
      sireId: dog.sireId ?? null,
      sireName: dog.sireName ?? null,
      damId: dog.damId ?? null,
      damName: dog.damName ?? null,
      profileImageUrl: dog.profileImageUrl ?? null,
      profileCardImageUrl: dog.profileCardImageUrl ?? null,
      profileDetailImageUrl: dog.profileDetailImageUrl ?? null,
      profileCardImagePath: dog.profileCardImagePath ?? null,
      profileDetailImagePath: dog.profileDetailImagePath ?? null,
      status: dog.status ?? null,
      updatedAt: serverTimestamp(),
    };

    if (includeCreatedAt) {
      payload.createdAt = serverTimestamp();
    }

    return payload;
  }

  private requireFirestore() {
    const firestore = this.firebaseAdminClientService.getFirestore();
    if (!firestore) {
      throw new Error('Firebase Firestore is not configured.');
    }

    return firestore;
  }

  private requireStorage() {
    const storage = this.firebaseAdminClientService.getStorage();
    if (!storage) {
      throw new Error('Firebase Storage is not configured.');
    }

    return storage;
  }

  private slugifyPageName(value: string): string {
    return value.trim().toLowerCase();
  }

  private extractStoragePathFromUrl(urlValue: string | null | undefined): string | null {
    if (!urlValue) {
      return null;
    }

    try {
      const url = new URL(urlValue);
      if (url.hostname !== 'firebasestorage.googleapis.com') {
        return null;
      }

      const pathMatch = url.pathname.match(/^\/v0\/b\/[^/]+\/o\/(.+)$/);
      if (!pathMatch) {
        return null;
      }

      return decodeURIComponent(pathMatch[1]);
    } catch {
      return null;
    }
  }

  private isStorageObjectMissingError(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'storage/object-not-found';
  }
}
