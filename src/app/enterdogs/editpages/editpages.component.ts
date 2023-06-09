import { Component, OnInit } from '@angular/core';
import { DogpagesService } from '../../dogpages.service'
import { DogService } from '../../dog.service'
import { Observable, forkJoin } from 'rxjs';
import { Pages } from '../../pages';
import { PageListItem } from './pageListItem';
import { Dog } from '../../dog';
import { map, startWith } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { UntypedFormGroup, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatLegacyAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { EnterdogsnavComponent } from '../enterdogsnav/enterdogsnav.component';

@Component({
    selector: 'app-editpages',
    templateUrl: './editpages.component.html',
    styleUrls: ['./editpages.component.css'],
    standalone: true,
    imports: [EnterdogsnavComponent, CdkDropList, FormsModule, MatLegacyFormFieldModule, MatLegacyInputModule, MatLegacyAutocompleteModule, ReactiveFormsModule, NgFor, MatLegacyOptionModule, CdkDrag, MatIconModule, AsyncPipe]
})
export class EditpagesComponent implements OnInit {
  boypages: PageListItem[];
  girlpages: PageListItem[];
  availablepages: PageListItem[];
  adultavailablepages: PageListItem[]
  allpages: PageListItem[];
  adddogform: UntypedFormGroup;
  doglist: Dog[]
  filteredOptions: Observable<Dog[]>;
  pageselect = new UntypedFormControl();

  constructor(
    private dogpagesService: DogpagesService,
    private dogService: DogService,
  ) { }

  ngOnInit() {
    const dogs = this.dogService.getDogs()
    const pages = this.dogpagesService.getDogPages()

    forkJoin(pages, dogs).subscribe(results => {
      this.doglist = results[1]
      this.allpages = results[0].map(page => this.addDogObjectToPage(page, results[1]))
      this.boypages = this.allpages.filter(dli => dli.pageName === "Boys")
      this.girlpages = this.allpages.filter(dli => dli.pageName === 'Girls')
      this.availablepages = this.allpages.filter(dli => dli.pageName === 'Available')
      this.adultavailablepages = this.allpages.filter(dli => dli.pageName === 'AdultAvailable')
      this.filteredOptions = this.pageselect.valueChanges
        .pipe(
          startWith<string | Dog>(''),
          map(value => typeof value === 'string' ? value : value.rname),
          map(name => name ? this._filter(name) : this.doglist.slice()),
        );
    })
  }

  private _filter(name: string): Dog[] {
    const filterValue = name.toLowerCase();

    return this.doglist.filter(option => option.rname.toLowerCase().includes(filterValue));
  }
  addnewdog(dog: Dog, pageName: string) {
    let page: PageListItem[]
    const newpageItem: PageListItem = {
      dog: this.doglist.find(d => d.id === dog.id),
      sortId: 0,
      pageName: pageName,
      dogsId: dog.id
    }
    
    switch (pageName) {
      case "Boys":
        page = this.boypages
        break;
      case "Girls":
        page = this.girlpages
        break;
      case "Available":
        page = this.availablepages
        break;
      case "AdultAvailable":
        page = this.adultavailablepages
        break;
    }
    page.push(newpageItem)
    this.sortpage(page)
    this.persistpage(page)
    this.pageselect.setValue('');

  }
  addDogObjectToPage(page: Pages, doglist: Dog[]): PageListItem {
    const filtereddog = doglist.find(d => { return d.id === page.dogsId });
    const newpage: PageListItem = {
      dog: filtereddog,
      sortId: page.sortId,
      pageName: page.pageName,
      dogsId: page.dogsId
    }
    return newpage
  }

  displayFn(dog?: Dog): string | undefined {
    return dog ? dog.rname : undefined;
  }

  drop(page: Pages[], event: CdkDragDrop<string[]>) {
    moveItemInArray(page, event.previousIndex, event.currentIndex);
    for (const i in page){
      page[i].sortId = Number(i)
    }
    this.sortpage(page)
    this.persistpage(page)
    
  }

  removedog(page: PageListItem[], index: number) {
    const pageitem = page[index]
    page.splice(index, 1);
    this.sortpage(page);
    this.dogpagesService.deleteFromPagesById(pageitem.pageName, pageitem.dogsId).subscribe();
    
    
  }

  sortpage(page: Pages[]) {
    page.sort((a,b) => a.sortId - b.sortId)
  }
  persistpage(page: Pages[]){
    this.dogpagesService.putPagesByPage(page[0].pageName, page).subscribe();
  }
}