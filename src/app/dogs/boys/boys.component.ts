import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Dog } from '../model/dog'
import { DogService } from '../../dog.service'
import { DogpagesService } from '../../dogpages.service'

import 'rxjs'
import { DogsComponent } from '../shared/dog-card/dogs.component';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-boys',
    templateUrl: './boys.component.html',
    styleUrls: ['./boys.component.css'],
    standalone: true,
    imports: [NgFor, DogsComponent, AsyncPipe]
})
export class BoysComponent implements OnInit {
  dogs: Observable<Dog[]>;


  constructor(
    private dogService: DogService,
    private dogpagesService: DogpagesService,
  ) {
  }

  ngOnInit() {

    this.dogs = this.dogpagesService.getDogsForPage('boys')
  }
}