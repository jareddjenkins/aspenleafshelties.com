import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

import { Dog } from '../model/dog';
import { DogsComponent } from '../dogs.component';

type AvailableDogStatus = 'showavailable' | 'available' | 'adultavailable';

interface AvailableTab {
  label: string;
  status: AvailableDogStatus;
  dogs: Dog[];
  emptyTitle: string;
  emptyMessage: string;
}

@Component({
  selector: 'app-available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.css'],
  imports: [DogsComponent, MatTabsModule, RouterLink],
  standalone: true,
})
export class AvailableComponent implements OnInit {
  showPuppies: Dog[] = [];
  companionPuppies: Dog[] = [];
  adults: Dog[] = [];
  tabs: AvailableTab[] = [];
  selectedIndex = 0;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.showPuppies = this.route.snapshot.data['showPuppies'] ?? [];
    this.companionPuppies = this.route.snapshot.data['companionPuppies'] ?? [];
    this.adults = this.route.snapshot.data['adults'] ?? [];

    this.tabs = [
      {
        label: 'Companion Puppies',
        status: 'available',
        dogs: this.companionPuppies,
        emptyTitle: 'No companion puppies right now.',
        emptyMessage: 'We would be happy to talk through timing and upcoming companion placements.',
      },
      {
        label: 'Show Puppies',
        status: 'showavailable',
        dogs: this.showPuppies,
        emptyTitle: 'No show puppies right now.',
        emptyMessage: 'Please check back for future evaluations and upcoming litters.',
      },
      {
        label: 'Adults',
        status: 'adultavailable',
        dogs: this.adults,
        emptyTitle: 'No adults available right now.',
        emptyMessage: 'Adult opportunities are uncommon, but we update this page when the right match becomes available.',
      },
    ];
  }
}
