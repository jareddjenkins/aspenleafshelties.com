import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dog } from '../model/dog';

@Component({
  selector: 'app-girls',
  templateUrl: './girls.component.html',
  styleUrls: ['./girls.component.css'],
  standalone: false,
})
export class GirlsComponent implements OnInit {
  dogs: Dog[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.dogs = this.route.snapshot.data['dogs'] ?? [];
  }
}
