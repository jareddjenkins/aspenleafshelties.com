import { Component, OnInit } from '@angular/core';
import { DogsComponent } from '../dogs/dogs.component';
import { Dog } from '../dog'
import { DogpagesService } from '../dogpages.service'

@Component({
  selector: 'app-boys',
  templateUrl: './boys.component.html',
  styleUrls: ['./boys.component.css']
})

export class BoysComponent implements OnInit {
  dogs: Dog[];

  constructor(private dogpagesService: DogpagesService) { }

  ngOnInit() {
    this.dogs = this.dogpagesService.getPageList('boys')
  }
}
