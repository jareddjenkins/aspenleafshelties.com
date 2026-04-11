import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dog } from '../model/dog';
import { DogsComponent } from '../dogs.component';

@Component({
  selector: 'app-boys',
  templateUrl: './boys.component.html',
  styleUrls: ['./boys.component.css'],
  imports: [DogsComponent],
  standalone: true,
})
export class BoysComponent implements OnInit {
  dogs: Dog[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.dogs = this.route.snapshot.data['dogs'] ?? [];
  }
}
