import { Component, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DogService } from '../../../dog.service';
import { forkJoin } from 'rxjs';
import { PageAssignment } from '../../../pages';
import { PageListItem } from './pageListItem';
import { Dog } from '../../model/dog';
import { DogpagesService } from 'src/app/dogpages.service';
import { FirestoreAdminDataService } from '../../../firebase/firestore-admin-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editpages',
  templateUrl: './editpages.component.html',
  styleUrls: ['./editpages.component.css'],
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  standalone: true,
})
export class EditpagesComponent implements OnInit {
  readonly boysPageName = 'boys';
  readonly girlsPageName = 'girls';
  readonly showAvailablePageName = 'showavailable';
  readonly availablePageName = 'available';
  readonly adultAvailablePageName = 'adultavailable';
  boypages: PageListItem[] = [];
  girlpages: PageListItem[] = [];
  showavailablepages: PageListItem[] = [];
  availablepages: PageListItem[] = [];
  adultavailablepages: PageListItem[] = [];
  allpages: PageListItem[] = [];
  doglist: Dog[] = [];
  dogSearch: Record<string, string> = {
    boys: '',
    girls: '',
    showavailable: '',
    available: '',
    adultavailable: '',
  };

  constructor(
    private dogpagesService: DogpagesService,
    private dogService: DogService,
    private firestoreAdminDataService: FirestoreAdminDataService,
    private router: Router,
  ) {}

  ngOnInit() {
    const dogs$ = this.dogService.getDogs();
    const pages$ = this.dogpagesService.getDogPages();

    forkJoin(pages$, dogs$).subscribe( (results) => {
      this.doglist = results[1]
        .slice()
        .sort((a, b) => (a.rname ?? '').localeCompare(b.rname ?? '', undefined, { sensitivity: 'base' }));
      this.allpages = results[0].map((page) =>
        this.addDogObjectToPage(page, this.doglist),
      );
      this.boypages = this.allpages.filter((dli) => this.normalizePageName(dli.pageName) === this.boysPageName);
      this.girlpages = this.allpages.filter((dli) => this.normalizePageName(dli.pageName) === this.girlsPageName);
      this.showavailablepages = this.allpages.filter(
        (dli) => this.normalizePageName(dli.pageName) === this.showAvailablePageName,
      );
      this.availablepages = this.allpages.filter(
        (dli) => this.normalizePageName(dli.pageName) === this.availablePageName,
      );
      this.adultavailablepages = this.allpages.filter(
        (dli) => this.normalizePageName(dli.pageName) === this.adultAvailablePageName,
      );
    });
  }

  addnewdog(pageName: string) {
    const page = this.getPage(pageName);
    if (!page) {
      return;
    }

    const searchValue = this.dogSearch[pageName]?.trim();
    if (!searchValue) {
      return;
    }

    const dog = this.doglist.find((item) => (item.rname ?? '') === searchValue);
    if (!dog) {
      return;
    }

    if (!this.canAssignDogToPage(dog, pageName)) {
      window.alert(this.getPageAssignmentBlockedMessage(dog, pageName));
      return;
    }

    const newpageItem: PageListItem = {
      dog,
      sortId: 0,
      pageName,
      dogId: dog.id,
    };

    if (page.some((item) => item.dogId === dog.id)) {
      this.dogSearch[pageName] = '';
      return;
    }
    page.push(newpageItem);
    this.sortpage(page);
    this.persistpage(pageName, page);
    this.dogSearch[pageName] = '';
  }
  addDogObjectToPage(page: PageAssignment, doglist: Dog[]): PageListItem {
    const filtereddog = doglist.find((d) => {
      return d.id === page.dogId;
    });
    const pageName = this.normalizePageName(page.pageName);
    const newpage: PageListItem = {
      dog: filtereddog,
      sortId: page.sortId,
      pageName,
      dogId: page.dogId,
    };
    return newpage;
  }

  drop(page: PageAssignment[], event: CdkDragDrop<any>) {
    moveItemInArray(page, event.previousIndex, event.currentIndex);
    for (const i in page) {
      page[i].sortId = Number(i);
    }
    this.sortpage(page);
    this.persistpage(this.getPageName(page), page);
  }

  removedog(pageName: string, page: PageListItem[], index: number) {
    page.splice(index, 1);
    this.sortpage(page);
    this.persistpage(pageName, page);
  }

  sortpage(page: PageAssignment[]) {
    for (const [index, pageItem] of page.entries()) {
      pageItem.sortId = index;
    }

    page.sort((a, b) => a.sortId - b.sortId);
  }

  persistpage(pageName: string, page: PageAssignment[]) {
    this.firestoreAdminDataService.putPagesByPage(pageName, page).subscribe();
  }

  goToEditDog(dogId: string): void {
    this.router.navigate(['/admin/editdog', dogId]);
  }

  filteredDogs(pageName: string): Dog[] {
    const query = this.dogSearch[pageName]?.trim().toLowerCase() ?? '';
    return this.doglist.filter((dog) => {
      if (!this.canAssignDogToPage(dog, pageName)) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (dog.rname ?? '').toLowerCase().includes(query);
    });
  }

  private getPage(pageName: string): PageListItem[] | null {
    switch (pageName) {
      case this.boysPageName:
        return this.boypages;
      case this.girlsPageName:
        return this.girlpages;
      case this.showAvailablePageName:
        return this.showavailablepages;
      case this.availablePageName:
        return this.availablepages;
      case this.adultAvailablePageName:
        return this.adultavailablepages;
      default:
        return null;
    }
  }

  private getPageName(page: PageAssignment[]): string {
    if (page === this.boypages) {
      return this.boysPageName;
    }

    if (page === this.girlpages) {
      return this.girlsPageName;
    }

    if (page === this.showavailablepages) {
      return this.showAvailablePageName;
    }

    if (page === this.availablepages) {
      return this.availablePageName;
    }

    return this.adultAvailablePageName;
  }

  private normalizePageName(value: string): string {
    return (value ?? '').replace(/\s+/g, '').toLowerCase();
  }

  private canAssignDogToPage(dog: Dog | undefined, pageName: string): boolean {
    if (!dog) {
      return false;
    }

    const normalizedPageName = this.normalizePageName(pageName);
    if (normalizedPageName !== this.boysPageName && normalizedPageName !== this.girlsPageName) {
      return true;
    }

    if (dog.gender !== true && dog.gender !== false) {
      return false;
    }

    return normalizedPageName === this.boysPageName ? dog.gender === true : dog.gender === false;
  }

  private getPageAssignmentBlockedMessage(dog: Dog, pageName: string): string {
    const normalizedPageName = this.normalizePageName(pageName);

    if (dog.gender !== true && dog.gender !== false) {
      return 'Set the dog gender before adding it to Boys or Girls.';
    }

    const dogName = dog.rname || dog.cname || 'This dog';
    return normalizedPageName === this.boysPageName
      ? `${dogName} cannot be added to Boys because the dog is marked Female.`
      : `${dogName} cannot be added to Girls because the dog is marked Male.`;
  }
}
