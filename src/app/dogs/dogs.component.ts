import { Component, OnInit, Input } from '@angular/core';
import { DOGS } from '../mock-dogs';
import { Dog } from '../dog';
import { DogService } from '../dog.service';

@Component({
  selector: 'app-dogs',
  templateUrl: './dogs.component.html',
  styleUrls: ['./dogs.component.css']
})

export class DogsComponent implements OnInit {
 @Input() dog: Dog;

  constructor() { }

  ngOnInit() {
 
  }  
}
