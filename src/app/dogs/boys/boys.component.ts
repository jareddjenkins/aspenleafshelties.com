import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Dog } from '../model/dog';
import { DogService } from '../../dog.service';
import { DogpagesService } from 'src/app/dogpages.service';

import 'rxjs';
import { DogsComponent } from '../shared/dog-card/dogs.component';

@Component({
  selector: 'app-boys',
  templateUrl: './boys.component.html',
  styleUrls: ['./boys.component.css'],
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
