import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,  of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Dog } from './dog';
import { MessageService } from './message.service';

import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DogService {
  private dogApiUrl = environment.apiEndpoint;  // URL to web api

  constructor(private http: HttpClient, private messageService: MessageService) { }
  /** Log a DogService message with the MessageService */
  private log(message: string) {
    this.messageService.add('DogService: ' + message);
  }
  getDogs(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogs`;
    return this.http.get<Dog[]>(url)
      .pipe(
        tap(dogs => this.log(`fetched dogs`)),
        catchError(this.handleError('getDogs', []))
      );
  }
  getMaleDogs(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogs?gender=1`;
    return this.http.get<Dog[]>(url)
      .pipe(
        tap(dogs => this.log(`fetched dogs`)),
        catchError(this.handleError('getDogs', []))
      );
  }
  getFemaleDogs(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogs?gender=0`;
    return this.http.get<Dog[]>(url)
      .pipe(
        tap(dogs => this.log(`fetched dogs`)),
        catchError(this.handleError('getDogs', []))
      );
  }

  getDog(id: number): Observable<Dog> {
    const url = `${this.dogApiUrl}/dogs/${id}`;
    return this.http.get<Dog>(url).pipe(
      tap(_ => this.log(`fetched dog id=${id}`)),
      catchError(this.handleError<Dog>(`getDog id=${id}`))
    );
  }

  getAvailablePage(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogpages/available`;
    return this.http.get<Dog[]>(url)
      .pipe(
        tap(dogs => this.log(`fetched dogs`)),
        catchError(this.handleError('getDogs', []))
      );
  }

  getBoysPage(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogpages/boys`;
    return this.http.get<Dog[]>(url)
      .pipe(
        tap(dogs => this.log(`fetched dogs`)),
        catchError(this.handleError('getDogs', []))
      );
  }


  getGirlsPage(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogpages/girls`;
    return this.http.get<Dog[]>(url)
      .pipe(
        tap(dogs => this.log(`fetched dogs`)),
        catchError(this.handleError('getDogs', []))
      );
  }

  /** PUT: update the dog on the server */
  updateDog(dog: Dog): Observable<Dog> {
    const url = `${this.dogApiUrl}/dogs/${dog.id}`;
    return this.http.put(url, dog, httpOptions).pipe(
      tap(_ => this.log(`updated dog id=${dog.id}`)),
      catchError(this.handleError<any>('updateDog'))
    );
  }

  /** POST: add a new dog to the server */
  addDog(dog: Dog): Observable<Dog> {
    const url = `${this.dogApiUrl}/dogs/${dog.id}`;
    return this.http.post<Dog>(url, dog, httpOptions).pipe(
      tap((dog: Dog) => this.log(`added dog w/ id=${dog.id}`)),
      catchError(this.handleError<Dog>('addDog'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}