import { Component, OnInit, ElementRef } from '@angular/core';
import { Dog } from '../model/dog';
import { DogpagesService } from '../../dogpages.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.scss'],
})
export class AvailableComponent implements OnInit {
  puppies: Observable<Dog[]>;
  adults: Observable<Dog[]>;

  constructor(private dogpagesService: DogpagesService) {}

  ngOnInit() {
    this.puppies = this.dogpagesService.getDogsForPage('available');
    this.adults = this.dogpagesService.getDogsForPage('adultavailable');
  }
  ScrollIntoView(elem: string) {
    document
      .querySelector(elem)
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
