import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { DogPage } from './pages';
import { Dog } from './dogs/model/dog';
import { DogService } from './dog.service';

import { environment } from '../environments/environment';
import { ErrorHandlingServiceService } from './error-handling-service.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DogpagesService {
  private pagesSubject: BehaviorSubject<DogPage[]> = new BehaviorSubject<DogPage[]>([])
  dogPages$ = this.pagesSubject.asObservable()
  private apiUrl = environment.apiEndpoint + '/DogPages';

  constructor(
    private http: HttpClient,
    private dogService: DogService,
    private errorHandler: ErrorHandlingServiceService
  ) { 
    this.fetchDogPages()
  }
  ngOnInit() {
    this.fetchDogPages()
  }

  fetchDogPages(): void {
    this.http.get<DogPage[]>(this.apiUrl).pipe(

      tap({    
        next: pages => this.pagesSubject.next(pages),
        error: catchError(this.errorHandler.handleError)
      })
    ).subscribe()
    this.dogPages$.subscribe(
      dogPages => 
      console.log('dog pages:', dogPages)
    )
  }
  getDogPage(pageName: string): Observable<DogPage[]> {
     return this.dogPages$.pipe(
      map(dogPages => dogPages
        .filter(page => page.pageName === pageName)
        .sort((a, b) => a.sortId - b.sortId)
      )
    )
  }

  getDogsOnPage(pageName: string): Observable<Dog[]>{
    return this.getDogPage(pageName).pipe(
      map(entries => this.sortPage(entries)),
      switchMap(sortedEntries => {
        const dogIds = sortedEntries.map(entry => entry.dogsId)
        return this.dogService.getDogByIds(dogIds)
        })
    )
  }

  sortPage(pages: DogPage[]): DogPage[] {
    return pages.sort((a, b) => a.sortId - b.sortId)
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
  AVAILABLE= 'available'

}
