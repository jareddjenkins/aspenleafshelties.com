import { Component, OnInit } from '@angular/core';
import { DogsComponent } from '../dogs/dogs.component';
import { Dog } from '../dog';
import { DogpagesService } from '../dogpages.service';
import { Observable, of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.css']
})
export class AvailableComponent implements OnInit {

  dogs: Observable<Dog[]>;

  constructor(private dogpagesService: DogpagesService) { }

  ngOnInit() {
    this.dogs = this.dogpagesService.getDogsForPage('available')
  }
}

