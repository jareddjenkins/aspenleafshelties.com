import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dog } from '../model/dog';
import { DogsComponent } from '../dogs.component';

@Component({
  selector: 'app-girls',
  templateUrl: './girls.component.html',
  styleUrls: ['./girls.component.css'],
  imports: [DogsComponent],
  standalone: true,
})
export class GirlsComponent implements OnInit {
  dogs: Dog[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.dogs = this.route.snapshot.data['dogs'] ?? [];
  }
}
