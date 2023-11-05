import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Dog } from '../model/dog';

import 'rxjs';
import { DogpagesService } from 'src/app/dogpages.service';
import { DogService } from 'src/app/dog.service';

@Component({
  selector: 'app-girls',
  templateUrl: './girls.component.html',
  styleUrls: ['./girls.component.scss'],
})
export class GirlsComponent implements OnInit {
  dogs: Observable<Dog[]>;

  constructor(private dogpagesService: DogpagesService,
    private dogService: DogService) {}

  ngOnInit() {
    this.dogpagesService.fetchDogPages()
    // this.dogs = this.dogService.getDogs()
    this.dogs = this.dogpagesService.getDogsOnPage('girls')
    // console.log('entered girls')
    //  this.dogpagesService.getDogsOnPage('girls').subscribe(
    //   data => console.log(data),
    //   error => console.log(error)
    // );
  }
}
