import { Component, OnInit } from '@angular/core';
import { DogsComponent } from '../dogs/dogs.component';
import { Dog } from '../dog'
import { DogpagesService } from '../dogpages.service'

@Component({
  selector: 'app-available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.css']
})
export class AvailableComponent implements OnInit {

  dogs: Dog[];

  constructor(private dogpagesService: DogpagesService) { }

  ngOnInit() {
    this.dogs = this.dogpagesService.getPageList('boys')
  }
}

