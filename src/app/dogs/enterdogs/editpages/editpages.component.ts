import { Component, OnInit } from '@angular/core';
import { DogService } from '../../../dog.service';
import { Observable, forkJoin } from 'rxjs';
import { Pages } from '../../../pages';
import { PageListItem } from './pageListItem';
import { Dog } from '../../model/dog';
import { map, startWith } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DogpagesService } from 'src/app/dogpages.service';

@Component({
  selector: 'app-editpages',
  templateUrl: './editpages.component.html',
  styleUrls: ['./editpages.component.css'],
})
export class EditpagesComponent implements OnInit {
  boypages: PageListItem[];
  girlpages: PageListItem[];
  availablepages: PageListItem[];
  adultavailablepages: PageListItem[];
  allpages: PageListItem[];
  adddogform: FormGroup;
  doglist: Dog[];
  filteredOptions: Observable<Dog[]>;
  pageselect = new FormControl();

  constructor(
    private dogpagesService: DogpagesService,
    private dogService: DogService,
  ) {}

  ngOnInit() {
    const dogs$ = this.dogService.getDogs();
    const pages$ = this.dogpagesService.getDogPages();

    forkJoin(pages$, dogs$).subscribe( (results) => {
      this.doglist = results[1];
      this.allpages = results[0].map((page) =>
        this.addDogObjectToPage(page, results[1]),
      );
      this.boypages = this.allpages.filter((dli) => dli.pageName === 'Boys');
      this.girlpages = this.allpages.filter((dli) => dli.pageName === 'Girls');
      this.availablepages = this.allpages.filter(
        (dli) => dli.pageName === 'Available',
      );
      this.adultavailablepages = this.allpages.filter(
        (dli) => dli.pageName === 'AdultAvailable',
      );
      this.filteredOptions = this.pageselect.valueChanges.pipe(
        startWith<string | Dog>(''),
        map((value) => (typeof value === 'string' ? value : value.rname)),
        map((name) => (name ? this._filter(name) : this.doglist.slice())),
      );
    });
  }

  private _filter(name: string): Dog[] {
    const filterValue = name.toLowerCase();

    return this.doglist.filter((option) =>
      option.rname.toLowerCase().includes(filterValue),
    );
  }
  addnewdog(dog: Dog, pageName: string) {
    let page: PageListItem[];
    const newpageItem: PageListItem = {
      dog: this.doglist.find((d) => d.id === dog.id),
      sortId: 0,
      pageName: pageName,
      dogsId: dog.id,
    };

    switch (pageName) {
      case 'Boys':
        page = this.boypages;
        break;
      case 'Girls':
        page = this.girlpages;
        break;
      case 'Available':
        page = this.availablepages;
        break;
      case 'AdultAvailable':
        page = this.adultavailablepages;
        break;
    }
    page.push(newpageItem);
    this.sortpage(page);
    this.persistpage(page);
    this.pageselect.setValue('');
  }
  addDogObjectToPage(page: Pages, doglist: Dog[]): PageListItem {
    const filtereddog = doglist.find((d) => {
      return d.id === page.dogsId;
    });
    const newpage: PageListItem = {
      dog: filtereddog,
      sortId: page.sortId,
      pageName: page.pageName,
      dogsId: page.dogsId,
    };
    return newpage;
  }

  displayFn(dog?: Dog): string | undefined {
    return dog ? dog.rname : undefined;
  }

  drop(page: Pages[], event: CdkDragDrop<any>) {
    moveItemInArray(page, event.previousIndex, event.currentIndex);
    for (const i in page) {
      page[i].sortId = Number(i);
    }
    this.sortpage(page);
    this.persistpage(page);
  }

  removedog(page: PageListItem[], index: number) {
    const pageitem = page[index];
    page.splice(index, 1);
    this.sortpage(page);
    this.dogpagesService
      .deleteFromPagesById(pageitem.pageName, pageitem.dogsId)
      .subscribe();
  }

  sortpage(page: Pages[]) {
    page.sort((a, b) => a.sortId - b.sortId);
  }
  persistpage(page: Pages[]) {
    this.dogpagesService.putPagesByPage(page[0].pageName, page).subscribe();
  }
}
