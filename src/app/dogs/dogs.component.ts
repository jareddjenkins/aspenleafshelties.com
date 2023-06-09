import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location, NgIf, DatePipe } from '@angular/common';

import { Dog } from '../dog';
import { DogService } from '../dog.service';

@Component({
    selector: 'app-dogs',
    templateUrl: './dogs.component.html',
    styleUrls: ['./dogs.component.css'],
    standalone: true,
    imports: [NgIf, DatePipe]
})

export class DogsComponent implements OnInit {
  
  @Input() 
  dog: Dog;

  lgImgUrl: string;

  constructor(private router: Router,private location: Location) { }

  ngOnInit() {

  }

  goDogDetails(): void {
    this.router.navigate([`/detail/${this.dog.id}`]);
  }
  goBack() : void {
    this.location.back();
  }

}
