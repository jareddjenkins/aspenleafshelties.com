import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Dog } from './model';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from './error-handling.service';
import { updateItemById } from '../utils';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DogService {
  private dogSubject: BehaviorSubject<Dog[]> = new BehaviorSubject<Dog[]>([]);
  private dogApiUrl = environment.apiEndpoint + '/dogs';

  dogs$: Observable<Dog[]> = this.dogSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService,
  ) { }

  getDogs(): Observable<Dog[]> {
    return this.dogs$;
  }

  fetchDogs(): void {
    this.http
      .get<Dog[]>(this.dogApiUrl)
      .subscribe({
        next: data => this.dogSubject.next(data),
        error: error => this.errorHandler.handleError(error),
      })
  }

  getMaleDogs(): Observable<Dog[]> {
    return this.dogs$.pipe(
      map((dogs) => dogs.filter((dog) => dog.gender === true)),
    );
  }
  getFemaleDogs(): Observable<Dog[]> {
    return this.dogs$.pipe(
      map((dogs) => dogs.filter((dog) => dog.gender === false)),
    );
  }

  getDogById(id: number): Observable<Dog> {
    return this.dogs$.pipe(
      map((dog) => {
        const foundDog = dog.find((d) => d.id === id);
        if (!foundDog || foundDog === null) {
          throw new Error(`Dog was not found for ID: ${id}`);
        } else {
          return foundDog;
        }
      }),
      catchError((e) => {
        this.errorHandler.handleError(e);
        throw e;
      }),
    );
  }
  getDogByIds(ids: number[]): Observable<Dog[]> {
    return this.dogs$.pipe(
      map((dogs) => {
        return dogs.filter((dog) => ids.includes(dog.id));
      }),
    );
  }
  setDogs(dogData: Dog[]): void {
    this.dogSubject.next(dogData);
  }

  addDog() {
    return this.http.post<Dog>(this.dogApiUrl, httpOptions).pipe(
      tap((newDog) => {
        const dogs = this.dogSubject.getValue();
        this.dogSubject.next([...dogs, newDog]);
      }),
    );
  }
  updateDog(dog: Dog) {
    this.http.put(this.dogApiUrl, dog, httpOptions).pipe(
      tap(() => {
        const currentDogs = this.dogSubject.getValue();
        const updatedDogs = updateItemById(currentDogs, dog);
        this.dogSubject.next(updatedDogs);
      }),
    );
  }

  uploadDogImage(id: number, image: Blob): Observable<string> {
    const fd = new FormData();
    interface imageResponse {
      imageUrl: string;
    }
    fd.append('image', image);
    const url = `${this.dogApiUrl}/${id}/Image`;
    return this.http.post<imageResponse>(url, fd).pipe(
      map((res) => {
        return res.imageUrl;
      }),
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
}
