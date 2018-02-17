import { Component, OnInit } from '@angular/core';
import { DogsComponent } from '../dogs/dogs.component';
import { Dog } from '../dog'
import { DogService } from '../dog.service'

@Component({
  selector: 'app-girls',
  templateUrl: './girls.component.html',
  styleUrls: ['./girls.component.css']
})
export class GirlsComponent implements OnInit {
  dogs: Dog[];

  constructor(private dogService: DogService) { }

  ngOnInit() {
    this.getGirlsPage();
  }

  getGirlsPage(): void {
    this.dogService.getGirlsPage()
      .subscribe(dogs => this.dogs = dogs);

  }
}
