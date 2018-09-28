import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Dog } from '../dog'
import { Pages } from '../pages'
import { DogService } from '../dog.service'
import { DogpagesService } from '../dogpages.service'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switch';

@Component({
  selector: 'app-girls',
  templateUrl: './girls.component.html',
  styleUrls: ['./girls.component.css']
})
export class GirlsComponent implements OnInit {
  dogs: Observable<Dog[]>;


  constructor(
    private dogService: DogService,
    private dogpagesService: DogpagesService,
  ) {
  }

  ngOnInit() {
    this.dogpagesService.getPage('girls')
      .map(res =>
        res.map((val) => {
          console.log(val)
          return val.dogsId
        }))
      .subscribe(obsNumbers => obsNumbers
        .map(num => this.dogService
          .getDog(num)
          .subscribe(dog => console.log(dog)
          )));
  }

}
