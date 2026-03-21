import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { Pages } from './pages';
import { Dog } from './dogs/model/dog';
import { FirestoreAdminDataService } from './firebase/firestore-admin-data.service';
import { FirestorePublicDataService } from './firebase/firestore-public-data.service';

@Injectable({
  providedIn: 'root',
})
export class DogpagesService {
  constructor(
    private firestoreAdminDataService: FirestoreAdminDataService,
    private firestorePublicDataService: FirestorePublicDataService,
  ) {}

  getDogPages(page?: string): Observable<Pages[]> {
    return this.firestorePublicDataService.getDogPages(page);
  }

  getDogsForPage(page?: string): Observable<Dog[]> {
    if (!page) {
      return throwError(() => new Error('getDogsForPage requires a page name.'));
    }

    return this.firestorePublicDataService.getDogsForPage(page);
  }

  putPagesByPage(_page: string, _updatedPages: Pages[]) {
    return this.firestoreAdminDataService.putPagesByPage(_page, _updatedPages);
  }

  deleteFromPagesById(_page: string, _id: number) {
    return this.firestoreAdminDataService.deleteFromPagesById(_page, _id);
  }
}
