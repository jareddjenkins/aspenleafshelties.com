import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

import { DogsComponent } from '../dogs.component';
import { Dog } from '../model/dog';

interface SheltiesTab {
  label: string;
  dogs: Dog[];
  emptyTitle: string;
  emptyMessage: string;
}

@Component({
  selector: 'app-our-shelties',
  templateUrl: './our-shelties.component.html',
  styleUrls: ['./our-shelties.component.css'],
  imports: [DogsComponent, MatCardModule, MatTabsModule],
  standalone: true,
})
export class OurSheltiesComponent implements OnInit {
  tabs: SheltiesTab[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const boys = this.route.snapshot.data['boys'] ?? [];
    const girls = this.route.snapshot.data['girls'] ?? [];

    this.tabs = [
      {
        label: 'Boys',
        dogs: boys,
        emptyTitle: 'No boys are listed right now.',
        emptyMessage: 'Please check back soon for the dogs currently featured in our program.',
      },
      {
        label: 'Girls',
        dogs: girls,
        emptyTitle: 'No girls are listed right now.',
        emptyMessage: 'Please check back soon for the dogs currently featured in our program.',
      },
    ];
  }
}
