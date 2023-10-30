import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location, NgIf, DatePipe } from '@angular/common';

import { Dog } from './model/dog';

@Component({
  selector: 'app-dogs',
  templateUrl: './dogs.component.html',
  styleUrls: ['./dogs.component.css'],
})
export class DogsComponent {
  @Input()
  dog: Dog;

  lgImgUrl: string;

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  goDogDetails(): void {
    this.router.navigate([`/detail/${this.dog.id}`]);
  }
  goBack(): void {
    this.location.back();
  }
}
