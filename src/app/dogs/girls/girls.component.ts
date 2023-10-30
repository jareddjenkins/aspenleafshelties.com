import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Dog } from '../model/dog'
import { DogService } from '../../dog.service'
import { DogpagesService } from '../../dogpages.service'






import 'rxjs'
import { DogsComponent } from '../shared/dog-card/dogs.component';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-girls',
    templateUrl: './girls.component.html',
    styleUrls: ['./girls.component.css'],
    standalone: true,
    imports: [NgFor, DogsComponent, AsyncPipe]
})
export class GirlsComponent implements OnInit {
  dogs: Observable<Dog[]>;


  constructor(
    private dogService: DogService,
    private dogpagesService: DogpagesService,
  ) {
  }

  ngOnInit() {

    this.dogs = this.dogpagesService.getDogsForPage('girls')
  }
}