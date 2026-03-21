import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Dog } from './dogs/model/dog';
import { MessageService } from './message.service';
import { FirestoreAdminDataService } from './firebase/firestore-admin-data.service';
import { FirestorePublicDataService } from './firebase/firestore-public-data.service';

@Injectable({
  providedIn: 'root',
})
export class DogService {
  constructor(
    private messageService: MessageService,
    private firestoreAdminDataService: FirestoreAdminDataService,
    private firestorePublicDataService: FirestorePublicDataService,
  ) {}

  private log(message: string) {
    this.messageService.add(`DogService: ${message}`);
  }

  getDogs(): Observable<Dog[]> {
    return this.firestorePublicDataService.getDogs().pipe(
      tap(() => this.log('fetched dogs from Firestore')),
      catchError(this.handleReadError('getDogs', [])),
    );
  }

  getMaleDogs(): Observable<Dog[]> {
    return this.firestorePublicDataService.getDogsByGender(1).pipe(
      tap(() => this.log('fetched male dogs from Firestore')),
      catchError(this.handleReadError('getMaleDogs', [])),
    );
  }

  getFemaleDogs(): Observable<Dog[]> {
    return this.firestorePublicDataService.getDogsByGender(0).pipe(
      tap(() => this.log('fetched female dogs from Firestore')),
      catchError(this.handleReadError('getFemaleDogs', [])),
    );
  }

  getDog(id: number): Observable<Dog> {
    return this.firestorePublicDataService.getDog(id).pipe(
      tap(() => this.log(`fetched dog id=${id} from Firestore`)),
      catchError(this.handleReadError<Dog>(`getDog id=${id}`)),
    );
  }

  getAvailablePage(): Observable<Dog[]> {
    return this.firestorePublicDataService.getDogsForPage('available').pipe(
      tap(() => this.log('fetched available dogs from Firestore')),
      catchError(this.handleReadError('getAvailablePage', [])),
    );
  }

  getBoysPage(): Observable<Dog[]> {
    return this.firestorePublicDataService.getDogsForPage('boys').pipe(
      tap(() => this.log('fetched boys from Firestore')),
      catchError(this.handleReadError('getBoysPage', [])),
    );
  }

  getGirlsPage(): Observable<Dog[]> {
    return this.firestorePublicDataService.getDogsForPage('girls').pipe(
      tap(() => this.log('fetched girls from Firestore')),
      catchError(this.handleReadError('getGirlsPage', [])),
    );
  }

  addDog(): Observable<Dog> {
    return this.firestoreAdminDataService.addDog().pipe(
      tap((dog) => this.log(`added dog w/ id=${dog.id} in Firestore`)),
    );
  }

  updateDog(dog: Dog): Observable<Dog> {
    return this.firestoreAdminDataService.updateDog(dog).pipe(
      tap(() => this.log(`updated dog id=${dog.id} in Firestore`)),
    );
  }

  uploadDogImage(id: number, image: Blob): Observable<string> {
    return this.firestoreAdminDataService.uploadDogImage(id, image).pipe(
      tap(() => this.log(`uploaded profile image for dog id=${id}`)),
    );
  }

  private handleReadError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
