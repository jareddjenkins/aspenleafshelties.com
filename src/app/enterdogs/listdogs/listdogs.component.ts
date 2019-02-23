import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Dog } from '../../dog'
import { DogService } from '../../dog.service'

@Component({
  selector: 'app-listdogs',
  templateUrl: './listdogs.component.html',
  styleUrls: ['./listdogs.component.css']
})
export class ListdogsComponent implements OnInit {
  dogs: Dog[];
  query:string = '';

  constructor(
    private dogService: DogService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.getDogs()
  }

  getDogs() {
    this.dogService.getDogs()
      .subscribe(dogs => this.dogs = dogs);
  }

  goBack(): void {
    this.location.back();
  }

}
