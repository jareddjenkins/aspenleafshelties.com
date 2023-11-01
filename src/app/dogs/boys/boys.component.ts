import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Dog } from '../model/dog';
import { DogpagesService } from 'src/app/dogpages.service';

import 'rxjs';

@Component({
  selector: 'app-boys',
  templateUrl: './boys.component.html',
  styleUrls: ['./boys.component.scss'],
})
export class BoysComponent implements OnInit {
  dogs: Observable<Dog[]>;

  constructor(
    private dogpagesService: DogpagesService,
  ) {}

  ngOnInit() {
    this.dogs = this.dogpagesService.getDogsForPage('boys');
  }
}
