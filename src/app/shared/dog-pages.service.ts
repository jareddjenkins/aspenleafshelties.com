import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { DogPage } from './model/';
import { Dog } from './model/';
import { DogService } from './dog.service';

import { environment } from '../../environments/environment';
import { ErrorHandlingService } from './error-handling.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DogPagesService {
  private pagesSubject: BehaviorSubject<DogPage[]> = new BehaviorSubject<
    DogPage[]
  >([]);
  dogPages$ = this.pagesSubject.asObservable();
  private apiUrl = environment.apiEndpoint + '/DogPages';

  constructor(
    private http: HttpClient,
    private dogService: DogService,
    private errorHandler: ErrorHandlingService,
  ) {
    this.fetchDogPages();
  }

  fetchDogPages(): void {
    this.http
      .get<DogPage[]>(this.apiUrl)
      .subscribe({
          next: (pages) => this.pagesSubject.next(pages),
          error: (error) => this.errorHandler.handleError(error),
        })
  }
  getDogPage(pageName: string): Observable<DogPage[]> {
    return this.dogPages$.pipe(
      map((dogPages) =>
        dogPages
          .filter((page) => page.pageName === pageName)
          .sort((a, b) => a.sortId - b.sortId),
      ),
    );
  }

  getDogsOnPage(pageName: string): Observable<Dog[]> {
    return this.getDogPage(pageName).pipe(
      map((entries) => this.sortPage(entries)),
      switchMap((sortedEntries) => {
        const dogIds = sortedEntries.map((entry) => entry.dogsId);
        return this.dogService.getDogByIds(dogIds);
      }),
    );
  }

  sortPage(pages: DogPage[]): DogPage[] {
    return pages.sort((a, b) => a.sortId - b.sortId);
  }

  putPagesByPage(pageName: string, updatedPages: Pages[]) {
    const url = `${this.apiUrl}/${pageName}`;
    return this.http.put(url, updatedPages, httpOptions);
  }
  deleteFromPagesById(page: string, id: number) {
    const url = `${this.apiUrl}/${page}/${id}`;

    return this.http.delete(url, httpOptions);
  }
}

enum Pages {
  GIRLS = 'girls',
  BOYS = 'boys',
  AVAILABLE = 'available',
}
