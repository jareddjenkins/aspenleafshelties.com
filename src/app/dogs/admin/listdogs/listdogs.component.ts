import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { DogService } from '../../../dog.service';
import { DogpagesService } from '../../../dogpages.service';
import { PageAssignment } from '../../../pages';
import { Dog } from '../../model/dog';
import {
  ListdogsFiltersDialogComponent,
  ListdogsFiltersDialogResult,
} from './listdogs-filters-dialog.component';

type DogSortField = 'rname' | 'cname' | 'status' | 'gender' | 'sireName' | 'damName' | 'dob' | 'activePages';
type SortDirection = 'asc' | 'desc';
type DogGenderFilter = 'male' | 'female';
type DogStatusFilter = 'none' | 'reserved' | 'sold';

@Component({
  selector: 'app-listdogs',
  templateUrl: './listdogs.component.html',
  styleUrls: ['./listdogs.component.css'],
  standalone: false,
})
export class ListdogsComponent implements OnInit {
  readonly pageFilterOptions = ['None', 'Boys', 'Girls', 'Show Puppies', 'Companion Puppies', 'Adults'] as const;

  dogs: Observable<Dog[]>;
  filteredDogs: Observable<Dog[]>;
  query = '';
  sortField: DogSortField = 'rname';
  sortDirection: SortDirection = 'asc';
  dogPages = new Map<string, string[]>();
  selectedGenderFilters: DogGenderFilter[] = [];
  selectedStatusFilters: DogStatusFilter[] = [];
  selectedPageFilters: string[] = [];
  isMobileView = false;

  private query$ = new BehaviorSubject<string>('');
  private sortField$ = new BehaviorSubject<DogSortField>('rname');
  private sortDirection$ = new BehaviorSubject<SortDirection>('asc');
  private genderFilters$ = new BehaviorSubject<DogGenderFilter[]>([]);
  private statusFilters$ = new BehaviorSubject<DogStatusFilter[]>([]);
  private pageFilters$ = new BehaviorSubject<string[]>([]);
  private dogPagesVersion$ = new BehaviorSubject<number>(0);

  constructor(
    private dogService: DogService,
    private dogpagesService: DogpagesService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.syncViewportDefaults();
    this.getDogs();
    this.getDogPages();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.syncViewportDefaults();
  }

  getDogs(): void {
    this.dogs = this.dogService.getDogs();
    this.filteredDogs = combineLatest([
      this.dogs,
      this.query$,
      this.sortField$,
      this.sortDirection$,
      this.genderFilters$,
      this.statusFilters$,
      this.pageFilters$,
      this.dogPagesVersion$,
    ]).pipe(
      map(([dogs, query, sortField, sortDirection, selectedGenderFilters, selectedStatusFilters, selectedPageFilters]) =>
        this.filterAndSortDogs(
          dogs,
          query,
          sortField,
          sortDirection,
          selectedGenderFilters,
          selectedStatusFilters,
          selectedPageFilters,
        ),
      ),
    );
  }

  getDogPages(): void {
    this.dogpagesService.getDogPages().subscribe((pages) => {
      this.dogPages = this.buildDogPagesMap(pages);
      this.dogPagesVersion$.next(this.dogPagesVersion$.value + 1);
    });
  }

  onQueryChange(value: string): void {
    this.query = value;
    this.query$.next(value);
  }

  onSortFieldChange(value: DogSortField): void {
    this.sortField = value;
    this.sortField$.next(value);
  }

  onSortDirectionChange(value: SortDirection): void {
    this.sortDirection = value;
    this.sortDirection$.next(value);
  }

  onGenderFilterChange(value: DogGenderFilter, checked: boolean): void {
    const nextFilters = checked
      ? [...this.selectedGenderFilters, value]
      : this.selectedGenderFilters.filter((filterValue) => filterValue !== value);

    this.selectedGenderFilters = nextFilters;
    this.genderFilters$.next(nextFilters);
  }

  onStatusFilterChange(value: DogStatusFilter, checked: boolean): void {
    const nextFilters = checked
      ? [...this.selectedStatusFilters, value]
      : this.selectedStatusFilters.filter((filterValue) => filterValue !== value);

    this.selectedStatusFilters = nextFilters;
    this.statusFilters$.next(nextFilters);
  }

  onPageFilterChange(pageName: string, checked: boolean): void {
    const nextFilters = checked
      ? [...this.selectedPageFilters, pageName]
      : this.selectedPageFilters.filter((filterName) => filterName !== pageName);

    this.selectedPageFilters = nextFilters;
    this.pageFilters$.next(nextFilters);
  }

  openFiltersDialog(): void {
    const dialogRef = this.dialog.open(ListdogsFiltersDialogComponent, {
      autoFocus: false,
      data: {
        sortField: this.sortField,
        sortDirection: this.sortDirection,
        selectedGenderFilters: this.selectedGenderFilters,
        selectedStatusFilters: this.selectedStatusFilters,
        selectedPageFilters: this.selectedPageFilters,
        pageFilterOptions: this.pageFilterOptions,
      },
      maxWidth: '100vw',
      width: this.isMobileView ? '100vw' : '28rem',
    });

    dialogRef.afterClosed().subscribe((result?: ListdogsFiltersDialogResult) => {
      if (!result) {
        return;
      }

      this.onSortFieldChange(result.sortField);
      this.onSortDirectionChange(result.sortDirection);
      this.selectedGenderFilters = result.selectedGenderFilters as DogGenderFilter[];
      this.genderFilters$.next(this.selectedGenderFilters);
      this.selectedStatusFilters = result.selectedStatusFilters as DogStatusFilter[];
      this.statusFilters$.next(this.selectedStatusFilters);
      this.selectedPageFilters = result.selectedPageFilters;
      this.pageFilters$.next(result.selectedPageFilters);
    });
  }

  getActivePages(dogId: string): string[] {
    return this.getDogPagesLabel(dogId);
  }

  clearQuery(): void {
    this.onQueryChange('');
  }

  clearGenderFilters(): void {
    this.selectedGenderFilters = [];
    this.genderFilters$.next([]);
  }

  clearStatusFilters(): void {
    this.selectedStatusFilters = [];
    this.statusFilters$.next([]);
  }

  clearPageFilters(): void {
    this.selectedPageFilters = [];
    this.pageFilters$.next([]);
  }

  removeGenderFilter(value: DogGenderFilter): void {
    this.onGenderFilterChange(value, false);
  }

  removeStatusFilter(value: DogStatusFilter): void {
    this.onStatusFilterChange(value, false);
  }

  removePageFilter(pageName: string): void {
    this.onPageFilterChange(pageName, false);
  }

  resetSorting(): void {
    this.onSortFieldChange('rname');
    this.onSortDirectionChange('asc');
  }

  clearAllFilters(): void {
    this.clearQuery();
    this.resetSorting();
    this.clearGenderFilters();
    this.clearStatusFilters();
    this.clearPageFilters();
  }

  hasActiveFilters(): boolean {
    return (
      Boolean(this.query.trim()) ||
      this.selectedGenderFilters.length > 0 ||
      this.selectedStatusFilters.length > 0 ||
      this.selectedPageFilters.length > 0 ||
      this.hasCustomSorting()
    );
  }

  hasCustomSorting(): boolean {
    return this.sortField !== 'rname' || this.sortDirection !== 'asc';
  }

  getActiveFilterCount(): number {
    let count = 0;

    if (this.query.trim()) {
      count += 1;
    }

    count += this.selectedGenderFilters.length;
    count += this.selectedStatusFilters.length;
    count += this.selectedPageFilters.length;

    if (this.hasCustomSorting()) {
      count += 1;
    }

    return count;
  }

  shouldShowResults(): boolean {
    return (
      Boolean(this.query.trim()) ||
      this.selectedGenderFilters.length > 0 ||
      this.selectedStatusFilters.length > 0 ||
      this.selectedPageFilters.length > 0
    );
  }

  getSortSummary(): string {
    const sortLabels: Record<DogSortField, string> = {
      activePages: 'Active Pages',
      cname: 'Call Name',
      damName: 'Dam',
      dob: 'Date of Birth',
      gender: 'Gender',
      rname: 'Registered Name',
      sireName: 'Sire',
      status: 'Status',
    };

    return `${sortLabels[this.sortField]}, ${this.sortDirection === 'asc' ? 'Ascending' : 'Descending'}`;
  }

  getGenderFilterLabel(value: DogGenderFilter): string {
    return value === 'male' ? 'Male' : 'Female';
  }

  getStatusFilterLabel(value: DogStatusFilter): string {
    switch (value) {
      case 'none':
        return 'None';
      case 'reserved':
        return 'Reserved';
      case 'sold':
        return 'Sold';
    }
  }

  private filterAndSortDogs(
    dogs: Dog[],
    query: string,
    sortField: DogSortField,
    sortDirection: SortDirection,
    selectedGenderFilters: DogGenderFilter[],
    selectedStatusFilters: DogStatusFilter[],
    selectedPageFilters: string[],
  ): Dog[] {
    const trimmedQuery = query.trim().toLowerCase();
    const textFilteredDogs = trimmedQuery
      ? dogs.filter((dog) =>
          [
            dog.rname,
            dog.cname,
            dog.gender === null ? null : dog.gender ? 'male' : 'female',
            dog.status,
            dog.sireName,
            dog.damName,
            dog.comments,
          ]
            .filter((value): value is string => Boolean(value))
            .some((value) => value.toLowerCase().includes(trimmedQuery)),
        )
      : dogs;

    const genderFilteredDogs = selectedGenderFilters.length
      ? textFilteredDogs.filter((dog) => this.matchesGenderFilters(dog, selectedGenderFilters))
      : textFilteredDogs;

    const statusFilteredDogs = selectedStatusFilters.length
      ? genderFilteredDogs.filter((dog) => this.matchesStatusFilters(dog, selectedStatusFilters))
      : genderFilteredDogs;

    const pageFilteredDogs = selectedPageFilters.length
      ? statusFilteredDogs.filter((dog) => this.matchesPageFilters(dog.id, selectedPageFilters))
      : statusFilteredDogs;

    return pageFilteredDogs
      .slice()
      .sort((a, b) => this.compareDogs(a, b, sortField, sortDirection));
  }

  private compareDogs(a: Dog, b: Dog, sortField: DogSortField, sortDirection: SortDirection): number {
    const direction = sortDirection === 'asc' ? 1 : -1;
    let comparison = 0;

    switch (sortField) {
      case 'gender':
        comparison = this.compareStrings(this.toGenderLabel(a.gender), this.toGenderLabel(b.gender));
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

  private matchesGenderFilters(dog: Dog, selectedGenderFilters: DogGenderFilter[]): boolean {
    const gender = this.toGenderLabel(dog.gender);
    return selectedGenderFilters.includes(gender as DogGenderFilter);
  }

  private matchesStatusFilters(dog: Dog, selectedStatusFilters: DogStatusFilter[]): boolean {
    const status = (dog.status ?? 'none') as DogStatusFilter;
    return selectedStatusFilters.includes(status);
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
      case 'showavailable':
        return 'Show Puppies';
      case 'adultavailable':
        return 'Adults';
      case 'available':
        return 'Companion Puppies';
      case 'boys':
        return 'Boys';
      case 'girls':
        return 'Girls';
      default:
        return value;
    }
  }

  private toGenderLabel(value: boolean | null | undefined): string {
    if (value === true) {
      return 'male';
    }

    if (value === false) {
      return 'female';
    }

    return '';
  }

  private syncViewportDefaults(): void {
    this.isMobileView = typeof window !== 'undefined' && window.innerWidth <= 700;
  }
}
