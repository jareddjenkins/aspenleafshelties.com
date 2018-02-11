import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Dog } from './dog';
import { DOGS } from './mock-dogs';

import { MessageService } from './message.service';
//import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DogService {
  private heroesUrl = 'api/heroes';  // URL to web api

  constructor(private messageService: MessageService) { }

  getDogs(): Observable<Dog[]> {

    // mocked dogs
     this.messageService.add('DogService: fetched dogs');

   // return this.http.get<Dog[]>(this.heroesUrl)
    return of(DOGS);
  }
}