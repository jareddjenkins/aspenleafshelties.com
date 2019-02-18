import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Dog } from '../dog'
import { DogService } from '../dog.service'
import { DogpagesService } from '../dogpages.service'






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

    this.dogs = this.dogpagesService.getPageList('girls')
  }
}