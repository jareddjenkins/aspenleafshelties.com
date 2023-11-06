import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DogPagesService } from 'src/app/shared/dog-pages.service';
import { DogService } from 'src/app/shared/dog.service';
import { Dog } from 'src/app/shared/model';

@Component({
  selector: 'app-available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.scss'],
})
export class AvailableComponent {
  adults$!: Observable<Dog[]>;
  puppies$!: Observable<Dog[]>;

  constructor(
    private dogService: DogService,
    private dogPagesService: DogPagesService,
  ) {}

  ngOnInit() {
    this.dogService.fetchDogs();
    this.adults$ = this.dogPagesService.getDogsOnPage('AdultAvailable');
    this.puppies$ = this.dogPagesService.getDogsOnPage('Available');
  }
}
