import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Dog } from '../../model/dog';
import { DogService } from '../../../dog.service';
import { FirestoreAdminDataService } from '../../../firebase/firestore-admin-data.service';
import { DogpagesService } from '../../../dogpages.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageAssignment } from '../../../pages';

type DogSortField = 'rname' | 'cname' | 'status' | 'gender' | 'sireName' | 'damName' | 'dob' | 'activePages';
type SortDirection = 'asc' | 'desc';

@Component({
    selector: 'app-listdogs',
    templateUrl: './listdogs.component.html',
    styleUrls: ['./listdogs.component.css'],
    standalone: false
})
export class ListdogsComponent implements OnInit {
  readonly pageFilterOptions = ['None', 'Boys', 'Girls', 'Available', 'Adult Available'] as const;
  dogs: Observable<Dog[]>;
  filteredDogs: Observable<Dog[]>;
  query = '';
  sortField: DogSortField = 'rname';
  sortDirection: SortDirection = 'asc';
  dogPages = new Map<string, string[]>();
  selectedPageFilters: string[] = [];
  private query$ = new BehaviorSubject<string>('');
  private sortField$ = new BehaviorSubject<DogSortField>('rname');
  private sortDirection$ = new BehaviorSubject<SortDirection>('asc');
  private pageFilters$ = new BehaviorSubject<string[]>([]);
  private dogPagesVersion$ = new BehaviorSubject<number>(0);

  constructor(
    private dogService: DogService,
    private dogpagesService: DogpagesService,
    private firestoreAdminDataService: FirestoreAdminDataService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getDogs();
    this.getDogPages();
  }
  createnewdog() {
    this.firestoreAdminDataService.addDog().subscribe((dog) => {
      this.getDogs();
      this.router.navigate([`/admin/editdog/${dog.id}`]);
    });
  }

  getDogs() {
    this.dogs = this.dogService.getDogs();
    this.filteredDogs = combineLatest([
      this.dogs,
      this.query$,
      this.sortField$,
      this.sortDirection$,
      this.pageFilters$,
      this.dogPagesVersion$,
    ]).pipe(
      map(([dogs, query, sortField, sortDirection, selectedPageFilters]) =>
        this.filterAndSortDogs(dogs, query, sortField, sortDirection, selectedPageFilters),
      ),
    );
  }

  getDogPages() {
    this.dogpagesService.getDogPages().subscribe((pages) => {
      this.dogPages = this.buildDogPagesMap(pages);
      this.dogPagesVersion$.next(this.dogPagesVersion$.value + 1);
    });
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

  onPageFilterChange(pageName: string, checked: boolean) {
    const nextFilters = checked
      ? [...this.selectedPageFilters, pageName]
      : this.selectedPageFilters.filter((filterName) => filterName !== pageName);

    this.selectedPageFilters = nextFilters;
    this.pageFilters$.next(nextFilters);
  }

  goToPages(): void {
    this.router.navigate(['/admin/pages']);
  }

  goBack(): void {
    this.location.back();
  }

  deleteDog(dog: Dog) {
    const pageNames = this.getDogPagesLabel(dog.id);
    if (pageNames.length > 0) {
      window.alert(
        `This dog cannot be deleted because it is still on these pages: ${pageNames.join(', ')}.`,
      );
      return;
    }

    const dogName = dog.rname || dog.cname || `Dog ${dog.id}`;
    const confirmed = window.confirm(`Delete ${dogName}? This permanently removes the dog record.`);
    if (!confirmed) {
      return;
    }

    this.firestoreAdminDataService.deleteDog(dog.id).subscribe({
      next: () => {
        this.getDogs();
        this.getDogPages();
      },
      error: (error: Error) => {
        window.alert(error.message || 'Unable to delete this dog.');
        this.getDogPages();
      },
    });
  }

  canDeleteDog(dogId: string): boolean {
    return this.getDogPagesLabel(dogId).length === 0;
  }

  getDeleteReason(dogId: string): string {
    const pageNames = this.getDogPagesLabel(dogId);
    return pageNames.length > 0
      ? `Cannot delete because this dog is on: ${pageNames.join(', ')}.`
      : 'Delete dog';
  }

  getActivePages(dogId: string): string[] {
    return this.getDogPagesLabel(dogId);
  }

  private filterAndSortDogs(
    dogs: Dog[],
    query: string,
    sortField: DogSortField,
    sortDirection: SortDirection,
    selectedPageFilters: string[],
  ): Dog[] {
    const trimmedQuery = query.trim().toLowerCase();
    const textFilteredDogs = trimmedQuery
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

    const pageFilteredDogs = selectedPageFilters.length
      ? textFilteredDogs.filter((dog) => this.matchesPageFilters(dog.id, selectedPageFilters))
      : textFilteredDogs;

    return pageFilteredDogs
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
      case 'activePages':
        comparison = this.compareActivePages(a.id, b.id);
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

  private compareActivePages(aDogId: string, bDogId: string): number {
    const aPages = this.getDogPagesLabel(aDogId);
    const bPages = this.getDogPagesLabel(bDogId);
    const countComparison = aPages.length - bPages.length;

    if (countComparison !== 0) {
      return countComparison;
    }

    return this.compareStrings(aPages.join(', '), bPages.join(', '));
  }

  private buildDogPagesMap(pages: PageAssignment[]): Map<string, string[]> {
    const pageMap = new Map<string, string[]>();

    for (const page of pages) {
      const existingPages = pageMap.get(page.dogId) ?? [];
      const displayName = this.toDisplayPageName(page.pageName);
      if (!existingPages.includes(displayName)) {
        existingPages.push(displayName);
        existingPages.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        pageMap.set(page.dogId, existingPages);
      }
    }

    return pageMap;
  }

  private getDogPagesLabel(dogId: string): string[] {
    return this.dogPages.get(dogId) ?? [];
  }

  private matchesPageFilters(dogId: string, selectedPageFilters: string[]): boolean {
    const activePages = this.getDogPagesLabel(dogId);

    return selectedPageFilters.some((filterName) =>
      filterName === 'None' ? activePages.length === 0 : activePages.includes(filterName),
    );
  }

  private toDisplayPageName(value: string): string {
    const normalized = value.trim().toLowerCase();

    switch (normalized) {
      case 'adultavailable':
        return 'Adult Available';
      case 'available':
        return 'Available';
      case 'boys':
        return 'Boys';
      case 'girls':
        return 'Girls';
      default:
        return value;
    }
  }
}
