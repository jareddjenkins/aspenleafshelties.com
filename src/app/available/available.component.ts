import { Component, OnInit } from '@angular/core';
import { DogsComponent } from '../dogs/dogs.component';
import { Dog } from '../dog'
import { DogService } from '../dog.service'

@Component({
  selector: 'app-available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.css']
})
export class AvailableComponent implements OnInit {

  dogs: Dog[];

  constructor(private dogService: DogService) { }

  ngOnInit() {
    this.getAvailablePage();
  }

  getAvailablePage(): void {
    this.dogService.getAvailablePage()
      .subscribe(dogs => this.dogs = dogs);

  }
}

