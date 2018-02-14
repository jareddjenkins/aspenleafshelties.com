import { Component, OnInit, Input } from '@angular/core';
import { DogsComponent } from '../dogs/dogs.component';
import { Dog } from '../dog'

@Component({
  selector: 'app-boys',
  templateUrl: './boys.component.html',
  styleUrls: ['./boys.component.css']
})
export class BoysComponent implements OnInit {
  @Input() dogs: Dog[];

  constructor() { }

  ngOnInit() {
  }

}
