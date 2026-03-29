import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dog } from '../model/dog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.css'],
  standalone: false,
})
export class AvailableComponent implements OnInit {
  puppies: Dog[] = [];
  adults: Dog[] = [];
  readonly questionnaireEnabled = environment.questionnaireEnabled;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.puppies = this.route.snapshot.data['puppies'] ?? [];
    this.adults = this.route.snapshot.data['adults'] ?? [];
  }
}
