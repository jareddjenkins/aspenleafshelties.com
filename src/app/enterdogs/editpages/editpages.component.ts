import { Component, OnInit } from '@angular/core';
import { DogpagesService } from '../../dogpages.service'
import { DogService } from '../../dog.service'
import { Observable, forkJoin } from 'rxjs';
import { Pages } from '../../pages';
import { PageListItem } from './pageListItem';
import { Dog } from '../../dog';
import { map, startWith, tap } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';





@Component({
  selector: 'app-editpages',
  templateUrl: './editpages.component.html',
  styleUrls: ['./editpages.component.css']
})
export class EditpagesComponent implements OnInit {
  boypages: PageListItem[];
  girlpages: PageListItem[];
  availablepages: PageListItem[];
  allpages: PageListItem[];
  adddogform: FormGroup;
  doglist: Dog[]
  filteredOptions: Observable<Dog[]>;
  boypageselect = new FormControl();

  constructor(
    private dogpagesService: DogpagesService,
    private dogService: DogService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {


    const dogs = this.dogService.getDogs()
    const pages = this.dogpagesService.getDogPages()

    forkJoin(pages, dogs).subscribe(results => {
      this.doglist = results[1]
      this.allpages = results[0].map(page => this.adddogtopage(page, results[1]))
      this.boypages = this.allpages.filter(dli => dli.pageName === "Boys")
      this.girlpages = this.allpages.filter(dli => dli.pageName === 'Girls')
      this.availablepages = this.allpages.filter(dli => dli.pageName === 'Available')
      this.filteredOptions = this.boypageselect.valueChanges
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
  sortbysortid(items: Pages[]) {
    items.sort((a, b) => (a.sortId > b.sortId) ? 1 : -1);
  }

  removedog(pages: PageListItem[], index: number) {
    pages.splice(index, 1);
    this.sortandupdatepage(pages);
  }

  drop(pages: Pages[], event: CdkDragDrop<any>) {
    moveItemInArray(pages, event.previousIndex, event.currentIndex);
    this.sortandupdatepage(pages)
  }

  sortandupdatepage(unsortedpage: Pages[], ) {
    var sortedpages = unsortedpage.map((p, index) => {
      let newpage: Pages = { sortId: index, pageName: p.pageName, dogsId: p.dogsId }
      return newpage
    });
    this.dogpagesService.putPagesByPage(sortedpages[0].pageName, sortedpages).subscribe();
  }

  addnewdog(dog: Dog) {
    let newdog = this.doglist.find(d => d.id === dog.id)
    let newpage: PageListItem = {
      dog: newdog,
      sortId: 0,
      pageName: "Boys",
      dogsId: dog.id
    }
    this.boypages.push(newpage)
    this.sortandupdatepage(this.boypages)

  }
  adddogtopage(page: Pages, doglist: Dog[]): PageListItem {
    let filtereddog = doglist.find(d => { return d.id === page.dogsId });
    let newpage: PageListItem = {
      dog: filtereddog,
      sortId: page.sortId,
      pageName: page.pageName,
      dogsId: page.dogsId
    }
    return newpage
  }

  displayFn(option?: Dog): string | undefined {
    return option ? option.rname : undefined;
  }

}

