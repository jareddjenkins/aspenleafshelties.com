import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Dog } from './dogs/model/dog';

import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private dogApiUrl = environment.apiEndpoint;  // URL to web api

  constructor(private http: HttpClient) { }
  /** Log a DogService message with the MessageService */

  getDogs(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogs`;
    return this.http.get<Dog[]>(url)
  }
  getMaleDogs(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogs?gender=1`;
    return this.http.get<Dog[]>(url)
  }
  getFemaleDogs(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogs?gender=0`;
    return this.http.get<Dog[]>(url)
  }

  getDog(id: number): Observable<Dog> {
    const url = `${this.dogApiUrl}/dogs/${id}`;
    return this.http.get<Dog>(url)
  }

  getAvailablePage(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogpages/available`;
    return this.http.get<Dog[]>(url)
  }

  getBoysPage(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogpages/boys`;
    return this.http.get<Dog[]>(url)
  }


  getGirlsPage(): Observable<Dog[]> {
    const url = `${this.dogApiUrl}/dogpages/girls`;
    return this.http.get<Dog[]>(url)
  }

  /** POST: add a new dog to the server */
  addDog() {
    const url = `${this.dogApiUrl}/dogs/`;
    return this.http.post<Dog>(url, httpOptions)
  }

  /** PUT: update the dog on the server */
  updateDog(dog: Dog): Observable<Dog> {
    const url = `${this.dogApiUrl}/dogs/${dog.id}`;
    return this.http.put(url, dog, httpOptions) as Observable<Dog>
  }

  // uploadDogImage(id: number, image: Blob): Observable<string> {
  //   const fd = new FormData();
  //   const url = `${this.dogApiUrl}/Dogs/${id}/Image`;
  //   fd.append('image', image)
  //   return this.http.post(url, fd, httpOptions).pipe(
  //     tap((imageUrl: string) => this.log(`new image url=${imageUrl}`)),
  //     catchError(this.handleError<any>('uploadDogImage'))
  //   );
  // }


  uploadDogImage(id: number, image: Blob): Observable<string> {
    const fd = new FormData();
    interface imageResponse {
      imageUrl: string;
    }
    fd.append('image', image)
    const url = `${this.dogApiUrl}/Dogs/${id}/Image`;
    return this.http.post<imageResponse>(url, fd).pipe(
      map(res => { return res.imageUrl })
    )
  }


}