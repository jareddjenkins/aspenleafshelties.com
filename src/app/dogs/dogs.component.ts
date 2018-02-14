import { Component, OnInit } from '@angular/core';
import { DOGS } from '../mock-dogs';
import { Dog } from '../dog';
import { DogService } from '../dog.service';

@Component({
  selector: 'app-dogs',
  templateUrl: './dogs.component.html',
  styleUrls: ['./dogs.component.css']
})

export class DogsComponent implements OnInit {

  selectedDog: Dog;

  dogs: Dog[];

  constructor(private dogService: DogService) { }

  ngOnInit() {
    this.getDogs();
  }
  onSelect(dog: Dog): void {
    this.selectedDog = dog;

  }
  getDogs(): void {
    this.dogService.getDogs()
      .subscribe(dogs => this.dogs = dogs);
  }
  
}
