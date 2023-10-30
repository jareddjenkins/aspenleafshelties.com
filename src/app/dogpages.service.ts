import { Injectable } from '@angular/core';

import {
  HttpErrorResponse,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Pages } from './pages';
import { Dog } from './dogs/model/dog';
import { DogService } from './dog.service';

import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DogpagesService {
  private dogApiUrl = environment.apiEndpoint;

  constructor(
    private http: HttpClient,
    private dogService: DogService,
  ) {}
  /** Log a DogService message with the MessageService */
  getDogPages(page?: string): Observable<Pages[]> {
    let url = `${this.dogApiUrl}/dogpages`;
    if (page) {
      url = `${this.dogApiUrl}/dogpages?page=${page}`;
    }
    return this.http.get<Pages[]>(url).pipe(
      map((x) => {
        return x.sort((a, b) => {
          return a.sortId - b.sortId;
        });
      }),
    );
  }

  getDogsForPage(page?: string): Observable<Dog[]> {
    const dogs = this.dogService.getDogs();
    const pages = this.getDogPages(page);

    return forkJoin(pages, dogs).pipe(
      map((results) => {
        return results[0].map(
          (p) =>
            results[1].filter((d) => {
              return d.id === p.dogsId;
            })[0],
        );
      }),
    );
  }
  putPagesByPage(page: string, updatedPages: Pages[]) {
    const url = `${this.dogApiUrl}/DogPages/${page}`;

    return this.http.put(url, updatedPages, httpOptions);
  }
  deleteFromPagesById(page: string, id: number) {
    const url = `${this.dogApiUrl}/DogPages/${page}/${id}`;

    return this.http.delete(url, httpOptions);
  }
}
