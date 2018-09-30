import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Pages } from './pages';
import { MessageService } from './message.service';

import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DogpagesService {
  private dogApiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient, private messageService: MessageService) { }
  /** Log a DogService message with the MessageService */
  private log(message: string) {
    this.messageService.add('DogService: ' + message);
  }
  getPageList(page: string): Observable<Pages[]> {
    const url = `${this.dogApiUrl}/dogpages/${page}`;
    return this.http.get<Pages[]>(url)
      .pipe(
        tap(page => this.log(`fetched dogs`)),
        catchError(this.handleError('getDogs', []))
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