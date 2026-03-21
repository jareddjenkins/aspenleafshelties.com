import { Injectable } from '@angular/core';
import { collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore/lite';
import { from, Observable, of } from 'rxjs';

import { Dog } from '../dogs/model/dog';
import { Pages } from '../pages';
import { FirebasePublicClientService } from './firebase-public-client.service';

type FirestoreDogDocument = {
  legacyId?: number;
  rname?: string | null;
  cname?: string | null;
  comments?: string | null;
  dob?: { toDate?: () => Date } | string | null;
  gender?: number | null;
  sireId?: number | null;
  sireName?: string | null;
  damId?: number | null;
  damName?: string | null;
  profileImageUrl?: string | null;
};

type FirestorePageDocument = {
  slug?: string;
  displayName?: string;
  dogIds?: string[];
  legacyPageName?: string;
};

@Injectable({
  providedIn: 'root',
})
export class FirestorePublicDataService {
  private firestore = this.firebasePublicClientService.getFirestore();

  constructor(private firebasePublicClientService: FirebasePublicClientService) {}

  isEnabled(): boolean {
    return this.firestore !== null;
  }

  getDogs(): Observable<Dog[]> {
    if (!this.firestore) {
      return of([]);
    }

    return from(this.fetchDogs());
  }

  getDog(id: number): Observable<Dog | undefined> {
    if (!this.firestore) {
      return of(undefined);
    }

    return from(this.fetchDog(id));
  }

  getDogsByGender(gender: number): Observable<Dog[]> {
    if (!this.firestore) {
      return of([]);
    }

    return from(this.fetchDogsByGender(gender));
  }

  getDogPages(page?: string): Observable<Pages[]> {
    if (!this.firestore) {
      return of([]);
    }

    return from(this.fetchDogPages(page));
  }

  getDogsForPage(page: string): Observable<Dog[]> {
    if (!this.firestore) {
      return of([]);
    }

    return from(this.fetchDogsForPage(page));
  }

  private async fetchDogs(): Promise<Dog[]> {
    const snapshot = await getDocs(collection(this.firestore!, 'dogs'));
    return snapshot.docs
      .map((docSnapshot) => this.toDog(docSnapshot.id, docSnapshot.data() as FirestoreDogDocument))
      .sort((a, b) => a.id - b.id);
  }

  private async fetchDog(id: number): Promise<Dog | undefined> {
    const snapshot = await getDoc(doc(this.firestore!, 'dogs', String(id)));
    if (!snapshot.exists()) {
      return undefined;
    }

    return this.toDog(snapshot.id, snapshot.data() as FirestoreDogDocument);
  }

  private async fetchDogsByGender(gender: number): Promise<Dog[]> {
    const dogsQuery = query(collection(this.firestore!, 'dogs'), where('gender', '==', gender));
    const snapshot = await getDocs(dogsQuery);

    return snapshot.docs
      .map((docSnapshot) => this.toDog(docSnapshot.id, docSnapshot.data() as FirestoreDogDocument))
      .sort((a, b) => a.id - b.id);
  }

  private async fetchDogPages(page?: string): Promise<Pages[]> {
    const pageSnapshots = page
      ? [await getDoc(doc(this.firestore!, 'pages', this.slugifyPageName(page)))]
      : (await getDocs(collection(this.firestore!, 'pages'))).docs;

    return pageSnapshots
      .filter((snapshot) => snapshot.exists())
      .flatMap((snapshot) => this.toPageRows(snapshot.id, snapshot.data() as FirestorePageDocument));
  }

  private async fetchDogsForPage(page: string): Promise<Dog[]> {
    const pageSnapshot = await getDoc(doc(this.firestore!, 'pages', this.slugifyPageName(page)));
    if (!pageSnapshot.exists()) {
      return [];
    }

    const pageData = pageSnapshot.data() as FirestorePageDocument;
    const dogIds = pageData.dogIds ?? [];

    if (dogIds.length === 0) {
      return [];
    }

    const dogs = new Map<string, Dog>();
    for (const chunk of this.chunk(dogIds, 10)) {
      const dogsQuery = query(collection(this.firestore!, 'dogs'), where(documentId(), 'in', chunk));
      const snapshot = await getDocs(dogsQuery);

      for (const dogSnapshot of snapshot.docs) {
        dogs.set(dogSnapshot.id, this.toDog(dogSnapshot.id, dogSnapshot.data() as FirestoreDogDocument));
      }
    }

    return dogIds
      .map((dogId) => dogs.get(dogId))
      .filter((dog): dog is Dog => Boolean(dog));
  }

  private toDog(id: string, data: FirestoreDogDocument): Dog {
    const dobValue = data.dob;
    const dob =
      dobValue && typeof dobValue === 'object' && typeof dobValue.toDate === 'function'
        ? dobValue.toDate()
        : typeof dobValue === 'string'
          ? new Date(dobValue)
          : null;

    return {
      id: Number(id),
      rname: data.rname ?? '',
      cname: data.cname ?? '',
      comments: data.comments ?? '',
      dob,
      damId: data.damId ?? null,
      damName: data.damName ?? '',
      sireId: data.sireId ?? null,
      sireName: data.sireName ?? '',
      gender: data.gender as unknown as boolean,
      profileImageUrl: data.profileImageUrl ?? '',
    };
  }

  private toPageRows(id: string, data: FirestorePageDocument): Pages[] {
    const pageName = data.displayName ?? data.legacyPageName ?? this.toDisplayName(id);
    return (data.dogIds ?? []).map((dogId, index) => ({
      dogsId: Number(dogId),
      pageName,
      sortId: index,
    }));
  }

  private chunk<T>(values: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < values.length; i += size) {
      chunks.push(values.slice(i, i + size));
    }
    return chunks;
  }

  private slugifyPageName(value: string): string {
    return value.trim().toLowerCase();
  }

  private toDisplayName(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
