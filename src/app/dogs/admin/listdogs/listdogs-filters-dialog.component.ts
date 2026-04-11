import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

type DogSortField = 'rname' | 'cname' | 'status' | 'gender' | 'sireName' | 'damName' | 'dob' | 'activePages';
type SortDirection = 'asc' | 'desc';

export type ListdogsFiltersDialogData = {
  sortField: DogSortField;
  sortDirection: SortDirection;
  selectedGenderFilters: string[];
  selectedStatusFilters: string[];
  selectedPageFilters: string[];
  pageFilterOptions: readonly string[];
};

export type ListdogsFiltersDialogResult = {
  sortField: DogSortField;
  sortDirection: SortDirection;
  selectedGenderFilters: string[];
  selectedStatusFilters: string[];
  selectedPageFilters: string[];
};

@Component({
  selector: 'app-listdogs-filters-dialog',
  templateUrl: './listdogs-filters-dialog.component.html',
  styleUrls: ['./listdogs-filters-dialog.component.css'],
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  standalone: true,
})
export class ListdogsFiltersDialogComponent {
  sortField: DogSortField;
  sortDirection: SortDirection;
  selectedGenderFilters: string[];
  selectedStatusFilters: string[];
  selectedPageFilters: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: ListdogsFiltersDialogData,
    private dialogRef: MatDialogRef<ListdogsFiltersDialogComponent, ListdogsFiltersDialogResult>,
  ) {
    this.sortField = data.sortField;
    this.sortDirection = data.sortDirection;
    this.selectedGenderFilters = [...data.selectedGenderFilters];
    this.selectedStatusFilters = [...data.selectedStatusFilters];
    this.selectedPageFilters = [...data.selectedPageFilters];
  }

  isGenderFilterSelected(value: string): boolean {
    return this.selectedGenderFilters.includes(value);
  }

  onGenderFilterChange(value: string, checked: boolean): void {
    this.selectedGenderFilters = checked
      ? [...this.selectedGenderFilters, value]
      : this.selectedGenderFilters.filter((filterValue) => filterValue !== value);
  }

  isStatusFilterSelected(value: string): boolean {
    return this.selectedStatusFilters.includes(value);
  }

  onStatusFilterChange(value: string, checked: boolean): void {
    this.selectedStatusFilters = checked
      ? [...this.selectedStatusFilters, value]
      : this.selectedStatusFilters.filter((filterValue) => filterValue !== value);
  }

  isPageFilterSelected(pageName: string): boolean {
    return this.selectedPageFilters.includes(pageName);
  }

  onPageFilterChange(pageName: string, checked: boolean): void {
    this.selectedPageFilters = checked
      ? [...this.selectedPageFilters, pageName]
      : this.selectedPageFilters.filter((filterName) => filterName !== pageName);
  }

  resetAll(): void {
    this.sortField = 'rname';
    this.sortDirection = 'asc';
    this.selectedGenderFilters = [];
    this.selectedStatusFilters = [];
    this.selectedPageFilters = [];
  }

  apply(): void {
    this.dialogRef.close({
      sortField: this.sortField,
      sortDirection: this.sortDirection,
      selectedGenderFilters: this.selectedGenderFilters,
      selectedStatusFilters: this.selectedStatusFilters,
      selectedPageFilters: this.selectedPageFilters,
    });
  }
}
