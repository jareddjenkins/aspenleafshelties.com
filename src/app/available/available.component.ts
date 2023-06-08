import { Component, OnInit, ElementRef } from '@angular/core';
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

  puppies: Observable<Dog[]>;
  adults: Observable<Dog[]>;

  constructor(private dogpagesService: DogpagesService) { }

  ngOnInit() {
    this.puppies = this.dogpagesService.getDogsForPage('available')
    this.adults = this.dogpagesService.getDogsForPage('adultavailable')
  }
  ScrollIntoView(elem: string) {
    document.querySelector(elem).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

