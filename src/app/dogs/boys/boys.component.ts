import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DogPagesService } from 'src/app/shared/dog-pages.service';
import { DogService } from 'src/app/shared/dog.service';
import { Dog } from 'src/app/shared/model';

@Component({
  selector: 'app-boys',
  templateUrl: './boys.component.html',
  styleUrls: ['./boys.component.scss'],
})
export class BoysComponent {
  dogs$!: Observable<Dog[]>;

  constructor(
    private dogService: DogService,
    private dogPagesService: DogPagesService,
  ) {}

  ngOnInit() {
    this.dogs$ = this.dogPagesService.getDogsOnPage('Boys');
    this.dogService.fetchDogs();
  }
}
