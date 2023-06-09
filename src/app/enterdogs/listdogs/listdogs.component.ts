import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { Location, NgFor, AsyncPipe, DatePipe } from '@angular/common';

import { Dog } from '../../dog'
import { DogService } from '../../dog.service'
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-listdogs',
    templateUrl: './listdogs.component.html',
    styleUrls: ['./listdogs.component.css'],
    standalone: true,
    imports: [FormsModule, NgFor, RouterLinkActive, RouterLink, MatIconModule, AsyncPipe, DatePipe]
})
export class ListdogsComponent implements OnInit {
  dogs: Observable<Dog[]>;
  query = '';

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
