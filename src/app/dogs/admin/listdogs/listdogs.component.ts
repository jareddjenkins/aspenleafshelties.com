import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Dog } from '../../model/dog';
import { DogService } from '../../../dog.service';
import { FirestoreAdminDataService } from '../../../firebase/firestore-admin-data.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-listdogs',
    templateUrl: './listdogs.component.html',
    styleUrls: ['./listdogs.component.css'],
    standalone: false
})
export class ListdogsComponent implements OnInit {
  dogs: Observable<Dog[]>;
  filteredDogs: Observable<Dog[]>;
  query = '';
  private query$ = new BehaviorSubject<string>('');

  constructor(
    private dogService: DogService,
    private firestoreAdminDataService: FirestoreAdminDataService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getDogs();
  }
  createnewdog() {
    this.firestoreAdminDataService.addDog().subscribe((dog) => {
      this.getDogs();
      this.router.navigate([`/admin/editdog/${dog.id}`]);
    });
  }

  getDogs() {
    this.dogs = this.dogService.getDogs();
    this.filteredDogs = combineLatest([this.dogs, this.query$]).pipe(
      map(([dogs, query]) => this.filterDogs(dogs, query)),
    );
  }

  onQueryChange(value: string) {
    this.query = value;
    this.query$.next(value);
  }

  goToPages(): void {
    this.router.navigate(['/admin/pages']);
  }

  goBack(): void {
    this.location.back();
  }

  private filterDogs(dogs: Dog[], query: string): Dog[] {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      return dogs;
    }

    return dogs.filter((dog) =>
      [
        dog.id?.toString(),
        dog.rname,
        dog.cname,
        dog.gender ? 'male' : 'female',
        dog.status,
        dog.sireName,
        dog.damName,
        dog.comments,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(trimmedQuery)),
    );
  }
}
