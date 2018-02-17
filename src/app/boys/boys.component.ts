import { Component, OnInit } from '@angular/core';
import { DogsComponent } from '../dogs/dogs.component';
import { Dog } from '../dog'
import { DogService } from '../dog.service'

@Component({
  selector: 'app-boys',
  templateUrl: './boys.component.html',
  styleUrls: ['./boys.component.css']
})

export class BoysComponent implements OnInit {
  dogs: Dog[];

  constructor(private dogService: DogService) { }

  ngOnInit() {
    this.getBoyspage();
  }

  getBoyspage(): void {
    this.dogService.getBoysPage()
      .subscribe(dogs => this.dogs = dogs);

  }
}
