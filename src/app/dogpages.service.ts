import { Injectable } from '@angular/core';

import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Pages } from './pages';
import { Dog } from './dogs/model/dog'
import { DogService } from './dog.service'
import { MessageService } from './message.service';

import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DogpagesService {
  private dogApiUrl = environment.apiEndpoint;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private dogService: DogService) { }
  /** Log a DogService message with the MessageService */
  private log(message: string) {
    this.messageService.add('DogService: ' + message);
  }
  getDogPages(page?: string): Observable<Pages[]> {
    
    let url = `${this.dogApiUrl}/dogpages`;if (page) {
      url = `${this.dogApiUrl}/dogpages?page=${page}`;
    } 
    return this.http.get<Pages[]>(url)
      .pipe(
        map(x => {
          return x.sort((a, b) => { return a.sortId - b.sortId });
        }))
  }

  getDogsForPage(page?: string): Observable<Dog[]> {


    const dogs = this.dogService.getDogs()
    const pages = this.getDogPages(page)

    return forkJoin(pages, dogs).pipe(
      map(results => {
        return results[0].map(p => results[1].filter(d => { return d.id === p.dogsId })[0])

      }))

  }
  putPagesByPage(page: string, updatedPages: Pages[]) {
    const url = `${this.dogApiUrl}/DogPages/${page}`;

    return this.http.put(url, updatedPages, httpOptions).pipe(
    tap(page => this.log(`updated pages=${page}`)),
      catchError(this.handleError)
    );

  }
  deleteFromPagesById(page: string, id: number) {
    const url = `${this.dogApiUrl}/DogPages/${page}/${id}`;

    return this.http.delete(url, httpOptions).pipe(
    tap(page => this.log(`updated pages=${page}`)),
      catchError(this.handleError)
    );

  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}