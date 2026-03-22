import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dog } from '../model/dog';

@Component({
  selector: 'app-boys',
  templateUrl: './boys.component.html',
  styleUrls: ['./boys.component.css'],
  standalone: false,
})
export class BoysComponent implements OnInit {
  dogs: Dog[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.dogs = this.route.snapshot.data['dogs'] ?? [];
  }
}
