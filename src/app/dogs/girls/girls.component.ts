import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Dog } from '../model/dog';

import 'rxjs';
import { DogpagesService } from 'src/app/dogpages.service';

@Component({
  selector: 'app-girls',
  templateUrl: './girls.component.html',
  styleUrls: ['./girls.component.scss'],
})
export class GirlsComponent implements OnInit {
  dogs: Observable<Dog[]>;

  constructor(private dogpagesService: DogpagesService) {}

  ngOnInit() {
    this.dogs = this.dogpagesService.getDogsForPage('girls');
  }
}
