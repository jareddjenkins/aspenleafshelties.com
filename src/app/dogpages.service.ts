import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,  of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Pages } from './pages';
import { Dog } from './dog'
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
  getPageList(page: string): Dog[] {
    let dogs: Dog[] = []
    const url = `${this.dogApiUrl}/dogpages/${page}`;

    this.http.get<Pages[]>(url)
      .subscribe(pageList => {
        pageList.map(listItem => {
          return this.dogService.getDog(listItem.dogsId)
        }).map(x => x.subscribe(x => dogs.push(x)))
      });

    return dogs;
  }
  getPages(): Observable<string[]> {
    let dogs: Dog[] = []
    const url = `${this.dogApiUrl}/dogpages/`;

    return this.http.get<string[]>(url)
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