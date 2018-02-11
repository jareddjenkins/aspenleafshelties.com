import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

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
  }
}