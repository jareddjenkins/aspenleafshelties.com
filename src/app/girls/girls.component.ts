import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Dog } from '../dog'
import { DogService } from '../dog.service'
import { DogpagesService } from '../dogpages.service'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/mergeAll'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/zip'
import 'rxjs'
import { map, concat, concatMap, mergeMap, switchMap, exhaustMap, delay, tap } from 'rxjs/operators';


@Component({
  selector: 'app-girls',
  templateUrl: './girls.component.html',
  styleUrls: ['./girls.component.css']
})
export class GirlsComponent implements OnInit {
  dogs: Dog[]=[];


  constructor(
    private dogService: DogService,
    private dogpagesService: DogpagesService,
  ) {
  }

  ngOnInit() {

    this.dogpagesService.getPageList('girls')
      .subscribe(pageList => {
        pageList.map(listItem => {
          return this.dogService.getDog(listItem.dogsId)
        }).map(x => x.subscribe(x => this.dogs.push(x)))
      })
  }
}