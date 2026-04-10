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
  showPuppies: Dog[] = [];
  companionPuppies: Dog[] = [];
  adults: Dog[] = [];
  readonly questionnaireEnabled = environment.questionnaireEnabled;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.showPuppies = this.route.snapshot.data['showPuppies'] ?? [];
    this.companionPuppies = this.route.snapshot.data['companionPuppies'] ?? [];
    this.adults = this.route.snapshot.data['adults'] ?? [];
  }
}
