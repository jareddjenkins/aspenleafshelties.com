import { Component, OnInit,  } from '@angular/core';
import { DogsComponent } from '../dogs/dogs.component';
import { Dog } from '../dog'
import { DogpagesService } from '../dogpages.service'
import { Observable, of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-boys',
  templateUrl: './boys.component.html',
  styleUrls: ['./boys.component.css']
})

export class BoysComponent implements OnInit {
  dogs: Observable<Dog[]>;

  constructor(private dogpagesService: DogpagesService) { }

  ngOnInit() {
   this.dogs = this.dogpagesService.getPageList('boys')
  }
}
