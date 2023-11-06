import { Component, OnInit } from '@angular/core';
import { DogService } from 'src/app/shared/dog.service';
import { Dog } from 'src/app/shared/model';
import { DogPagesService } from 'src/app/shared/dog-pages.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-girls',
  templateUrl: './girls.component.html',
  styleUrls: ['./girls.component.scss'],
})
export class GirlsComponent implements OnInit {
  dogs$!: Observable<Dog[]>;

  constructor(
    private dogService: DogService,
    private dogPagesService: DogPagesService,
  ) {}

  ngOnInit() {
    this.dogService.fetchDogs();
    this.dogs$ = this.dogPagesService.getDogsOnPage('Girls');
  }
}
