import { Component, OnInit,  } from '@angular/core';
import { DogsComponent } from '../shared/dog-card/dogs.component';
import { Dog } from '../model/dog'
import { DogpagesService } from '../../dogpages.service'
import { Observable, of, forkJoin } from 'rxjs';


@Component({
    selector: 'app-boys',
    templateUrl: './boys.component.html',
    styleUrls: ['./boys.component.css'],
})

export class BoysComponent implements OnInit {
  dogs: Observable<Dog[]>;

  constructor(private dogpagesService: DogpagesService) { }

  ngOnInit() {
   this.dogs = this.dogpagesService.getDogsForPage('boys')
  }
}
