import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { from, Observable, throwError } from 'rxjs';

import { Dog } from '../dogs/model/dog';
import { Pages } from '../pages';
import { FirebaseAdminClientService } from './firebase-admin-client.service';

type FirestoreDogPayload = {
  legacyId: number;
  rname: string;
  cname: string;
  comments: string;
  dob: Date | null;
  gender: number;
  sireId: number | null;
  sireName: string | null;
  damId: number | null;
  damName: string | null;
  profileImageUrl: string | null;
  updatedAt: unknown;
  createdAt?: unknown;
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

  uploadDogImage(id: number, image: Blob): Observable<string> {
    return from(this.uploadProfileImage(id, image));
  }

  putPagesByPage(pageName: string, updatedPages: Pages[]): Observable<void> {
    return from(this.savePage(pageName, updatedPages));
  }

  deleteFromPagesById(pageName: string, id: number): Observable<void> {
    return from(this.removeDogFromPage(pageName, id));
  }

  private async createDog(): Promise<Dog> {
    const firestore = this.requireFirestore();
    const nextId = await this.getNextDogId();
    const dog: Dog = {
      id: nextId,
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
    };

    await setDoc(doc(firestore, 'dogs', String(nextId)), this.toDogPayload(dog, true));
    return dog;
  }

  private async saveDog(dog: Dog): Promise<Dog> {
    const firestore = this.requireFirestore();
    await setDoc(doc(firestore, 'dogs', String(dog.id)), this.toDogPayload(dog), {
      merge: true,
    });
    return dog;
  }

  private async uploadProfileImage(id: number, image: Blob): Promise<string> {
    const storage = this.requireStorage();
    const firestore = this.requireFirestore();
    const extension = this.getImageExtension(image.type);
    const imageRef = ref(storage, `profile/testimages/profile_${id}.${extension}`);

    await uploadBytes(imageRef, image, {
      contentType: image.type || 'image/jpeg',
    });

    const downloadUrl = await getDownloadURL(imageRef);
    await updateDoc(doc(firestore, 'dogs', String(id)), {
      profileImageUrl: downloadUrl,
      updatedAt: serverTimestamp(),
    });

    return downloadUrl;
  }

  private getImageExtension(contentType: string | undefined): 'jpg' | 'png' {
    return contentType === 'image/png' ? 'png' : 'jpg';
  }

  private async savePage(pageName: string, updatedPages: Pages[]): Promise<void> {
    const firestore = this.requireFirestore();
    const slug = this.slugifyPageName(pageName);
    const pageRef = doc(firestore, 'pages', slug);

    await setDoc(
      pageRef,
      {
        slug,
        displayName: pageName,
        legacyPageName: pageName,
        dogIds: updatedPages
          .slice()
          .sort((a, b) => a.sortId - b.sortId)
          .map((page) => String(page.dogsId)),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  private async removeDogFromPage(pageName: string, id: number): Promise<void> {
    const firestore = this.requireFirestore();
    const slug = this.slugifyPageName(pageName);
    const pageRef = doc(firestore, 'pages', slug);
    const pageSnapshot = await getDoc(pageRef);

    if (!pageSnapshot.exists()) {
      return;
    }

    const data = pageSnapshot.data() as { dogIds?: string[]; displayName?: string; legacyPageName?: string };
    const dogIds = (data.dogIds ?? []).filter((dogId) => dogId !== String(id));

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

  private async getNextDogId(): Promise<number> {
    const firestore = this.requireFirestore();
    const snapshot = await getDocs(collection(firestore, 'dogs'));
    return (
      snapshot.docs.reduce((maxId, dogSnapshot) => {
        const dogId = Number(dogSnapshot.id);
        return Number.isFinite(dogId) ? Math.max(maxId, dogId) : maxId;
      }, 0) + 1
    );
  }

  private toDogPayload(dog: Dog, includeCreatedAt = false): FirestoreDogPayload {
    const payload: FirestoreDogPayload = {
      legacyId: dog.id,
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
}
