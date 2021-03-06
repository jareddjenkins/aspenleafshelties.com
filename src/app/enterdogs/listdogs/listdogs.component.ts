import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Dog } from '../../dog'
import { DogService } from '../../dog.service'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listdogs',
  templateUrl: './listdogs.component.html',
  styleUrls: ['./listdogs.component.css']
})
export class ListdogsComponent implements OnInit {
  dogs: Observable<Dog[]>;
  query:string = '';

  constructor(
    private dogService: DogService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.getDogs()
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
