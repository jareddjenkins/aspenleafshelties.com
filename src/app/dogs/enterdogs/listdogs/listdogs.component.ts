import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Dog } from '../../model/dog';
import { DogService } from '../../../dog.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listdogs',
  templateUrl: './listdogs.component.html',
  styleUrls: ['./listdogs.component.css'],
})
export class ListdogsComponent implements OnInit {
  dogs: Observable<Dog[]>;
  query = '';

  constructor(
    private dogService: DogService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.getDogs();
  }
  createnewdog() {
    this.dogService.addDog().subscribe();
    this.getDogs();
  }

  getDogs() {
    this.dogs = this.dogService.getDogs();
  }

  goBack(): void {
    this.location.back();
  }
}
