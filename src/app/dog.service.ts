import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Dog } from './dog';
import { DOGS } from './mock-dogs';

import { MessageService } from './message.service';

@Injectable()
export class DogService {
  private dogApiUrl = 'http://localhost:65096/api/dogs';  // URL to web api

  constructor(private http: HttpClient, private messageService: MessageService) { }
  /** Log a DogService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
  getDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(this.dogApiUrl)
      .pipe(
        tap(dogs => this.log(`fetched dogs`)),
        catchError(this.handleError('getDogs', []))
      );
  }
  /** GET hero by id. Will 404 if id not found */
  getDog(id: number): Observable<Dog> {
    const url = `${this.dogApiUrl}/${id}`;
    return this.http.get<Dog>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Dog>(`getDog id=${id}`))
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