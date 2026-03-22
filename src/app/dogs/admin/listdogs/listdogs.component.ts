import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Dog } from '../../model/dog';
import { DogService } from '../../../dog.service';
import { FirestoreAdminDataService } from '../../../firebase/firestore-admin-data.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

type DogSortField = 'rname' | 'cname' | 'status' | 'gender' | 'sireName' | 'damName' | 'dob';
type SortDirection = 'asc' | 'desc';

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
  sortField: DogSortField = 'rname';
  sortDirection: SortDirection = 'asc';
  private query$ = new BehaviorSubject<string>('');
  private sortField$ = new BehaviorSubject<DogSortField>('rname');
  private sortDirection$ = new BehaviorSubject<SortDirection>('asc');

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
    this.filteredDogs = combineLatest([this.dogs, this.query$, this.sortField$, this.sortDirection$]).pipe(
      map(([dogs, query, sortField, sortDirection]) =>
        this.filterAndSortDogs(dogs, query, sortField, sortDirection),
      ),
    );
  }

  onQueryChange(value: string) {
    this.query = value;
    this.query$.next(value);
  }

  onSortFieldChange(value: DogSortField) {
    this.sortField = value;
    this.sortField$.next(value);
  }

  onSortDirectionChange(value: SortDirection) {
    this.sortDirection = value;
    this.sortDirection$.next(value);
  }

  goToPages(): void {
    this.router.navigate(['/admin/pages']);
  }

  goBack(): void {
    this.location.back();
  }

  private filterAndSortDogs(
    dogs: Dog[],
    query: string,
    sortField: DogSortField,
    sortDirection: SortDirection,
  ): Dog[] {
    const trimmedQuery = query.trim().toLowerCase();
    const filteredDogs = trimmedQuery
      ? dogs.filter((dog) =>
          [
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
        )
      : dogs;

    return filteredDogs
      .slice()
      .sort((a, b) => this.compareDogs(a, b, sortField, sortDirection));
  }

  private compareDogs(a: Dog, b: Dog, sortField: DogSortField, sortDirection: SortDirection): number {
    const direction = sortDirection === 'asc' ? 1 : -1;
    let comparison = 0;

    switch (sortField) {
      case 'gender':
        comparison = this.compareStrings(a.gender ? 'male' : 'female', b.gender ? 'male' : 'female');
        break;
      case 'status':
        comparison = this.compareStatus(a.status, b.status);
        break;
      case 'dob':
        comparison = this.compareDates(a.dob, b.dob);
        break;
      default:
        comparison = this.compareStrings(a[sortField], b[sortField]);
        break;
    }

    if (comparison === 0) {
      comparison = this.compareStrings(a.rname, b.rname);
    }

    return comparison * direction;
  }

  private compareStrings(a: string | null | undefined, b: string | null | undefined): number {
    return (a ?? '').localeCompare(b ?? '', undefined, { sensitivity: 'base' });
  }

  private compareDates(a: Date | string | null | undefined, b: Date | string | null | undefined): number {
    const aTime = a ? new Date(a).getTime() : 0;
    const bTime = b ? new Date(b).getTime() : 0;
    return aTime - bTime;
  }

  private compareStatus(a: Dog['status'], b: Dog['status']): number {
    const rank = {
      null: 0,
      reserved: 1,
      sold: 2,
    } as const;

    return rank[a ?? 'null'] - rank[b ?? 'null'];
  }
}
