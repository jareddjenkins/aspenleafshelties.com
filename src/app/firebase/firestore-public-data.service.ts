import { Injectable } from '@angular/core';
import { collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore/lite';
import { from, Observable, of } from 'rxjs';

import { Dog } from '../dogs/model/dog';
import { DogPageDocument, PageAssignment } from '../pages';
import { FirebasePublicClientService } from './firebase-public-client.service';
import { normalizeFirebaseEmulatorUrl } from './firebase-web-config';

type FirestoreDogDocument = {
  rname?: string | null;
  cname?: string | null;
  comments?: string | null;
  dob?: { toDate?: () => Date } | string | null;
  gender?: number | null;
  sireId?: string | null;
  sireName?: string | null;
  damId?: string | null;
  damName?: string | null;
  price?: number | null;
  profileImageUrl?: string | null;
  profileCardImageUrl?: string | null;
  profileDetailImageUrl?: string | null;
  profileCardImagePath?: string | null;
  profileDetailImagePath?: string | null;
  status?: string | null;
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

  getDog(id: string): Observable<Dog | undefined> {
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

  getDogPages(page?: string): Observable<PageAssignment[]> {
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
      .sort((a, b) => this.compareDogIds(a.id, b.id));
  }

  private async fetchDog(id: string): Promise<Dog | undefined> {
    const snapshot = await getDoc(doc(this.firestore!, 'dogs', id));
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
      .sort((a, b) => this.compareDogIds(a.id, b.id));
  }

  private async fetchDogPages(page?: string): Promise<PageAssignment[]> {
    const pageSnapshots = page
      ? [await getDoc(doc(this.firestore!, 'pages', this.slugifyPageName(page)))]
      : (await getDocs(collection(this.firestore!, 'pages'))).docs;

    return pageSnapshots
      .filter((snapshot) => snapshot.exists())
      .flatMap((snapshot) => this.toPageAssignments(snapshot.id, snapshot.data() as Partial<DogPageDocument>));
  }

  private async fetchDogsForPage(page: string): Promise<Dog[]> {
    const pageSnapshot = await getDoc(doc(this.firestore!, 'pages', this.slugifyPageName(page)));
    if (!pageSnapshot.exists()) {
      return [];
    }

    const pageData = pageSnapshot.data() as Partial<DogPageDocument>;
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
    let normalizedDobValue: Date | string | null;
    if (dobValue && typeof dobValue === 'object') {
      normalizedDobValue = typeof dobValue.toDate === 'function' ? dobValue.toDate() : null;
    } else if (typeof dobValue === 'string') {
      normalizedDobValue = dobValue;
    } else {
      normalizedDobValue = null;
    }
    const dob = this.normalizeDate(normalizedDobValue);

    return {
      id,
      rname: this.normalizeText(data.rname),
      cname: this.normalizeText(data.cname),
      comments: this.normalizeText(data.comments),
      dob,
      damId: data.damId ?? null,
      damName: this.normalizeText(data.damName),
      sireId: data.sireId ?? null,
      sireName: this.normalizeText(data.sireName),
      gender: Number(data.gender ?? 0) === 1,
      price: typeof data.price === 'number' && Number.isFinite(data.price) ? data.price : null,
      profileImageUrl: this.normalizeImageUrl(data.profileImageUrl),
      profileCardImageUrl: this.normalizeImageUrl(data.profileCardImageUrl) || this.normalizeImageUrl(data.profileImageUrl),
      profileDetailImageUrl: this.normalizeImageUrl(data.profileDetailImageUrl) || this.normalizeImageUrl(data.profileImageUrl),
      profileCardImagePath: data.profileCardImagePath ?? null,
      profileDetailImagePath: data.profileDetailImagePath ?? null,
      status: data.status === 'reserved' || data.status === 'sold' ? data.status : null,
    };
  }

  private toPageAssignments(id: string, data: Partial<DogPageDocument>): PageAssignment[] {
    const pageName = data.displayName ?? data.legacyPageName ?? this.toDisplayName(id);
    return (data.dogIds ?? []).map((dogId, index) => ({
      dogId,
      pageName,
      sortId: index,
    }));
  }

  private compareDogIds(a: string, b: string): number {
    const aNumber = Number(a);
    const bNumber = Number(b);

    if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
      return aNumber - bNumber;
    }

    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
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

  private normalizeText(value: string | null | undefined): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private normalizeImageUrl(value: string | null | undefined): string {
    const normalizedValue = this.normalizeText(value);
    return normalizedValue ? normalizeFirebaseEmulatorUrl(normalizedValue) : '';
  }

  private normalizeDate(value: Date | string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
