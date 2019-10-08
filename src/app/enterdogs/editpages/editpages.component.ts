import { Component, OnInit } from '@angular/core';
import { DogpagesService } from '../../dogpages.service'
import { DogService } from '../../dog.service'
import { Observable, forkJoin } from 'rxjs';
import { Pages } from '../../pages';
import { PageListItem } from './pageListItem';
import { Dog } from '../../dog';
import { map, startWith } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';





@Component({
  selector: 'app-editpages',
  templateUrl: './editpages.component.html',
  styleUrls: ['./editpages.component.css']
})
export class EditpagesComponent implements OnInit {
  boypages: Pages[];
  girlpages: Pages[];
  availablepages: Pages[];
  adddogform: FormGroup;
  doglist: Dog[]
  filteredOptions: Observable<Dog[]>;

  get eachdogform(): FormArray {
    return <FormArray>this.adddogform.get('eachdogform');
  }

  // get adddogformarray(): FormArray {
  //   return <FormArray>this.adddogform.get("adddogformarray");
  // }

  constructor(
    private dogpagesService: DogpagesService,
    private dogService: DogService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {


    this.adddogform = this.fb.group({
      eachdogform: this.fb.array([])
    });

    const dogs = this.dogService.getDogs()
    const pages = this.dogpagesService.getDogPages()

    forkJoin(pages, dogs).subscribe(results => {
      this.doglist = results[1]
      let allpages = results[0].map(page => this.adddogtopage(page, results[1]))
      this.boypages = allpages.filter(dli => dli.pageName === "Boys")
      this.girlpages = allpages.filter(dli => dli.pageName === 'Girls')
      this.availablepages = allpages.filter(dli => dli.pageName === 'Available')
    })

    this.filteredOptions = this.adddogform.valueChanges
      .pipe(
        startWith<string | Dog>(''),
        map(value => typeof value === 'string' ? value : value.rname),
        map(name => name ? this._filter(name) : this.doglist.slice())
      );

  }

  private _filter(name: string): Dog[] {
    const filterValue = name.toLowerCase();

    return this.doglist.filter(option => option.rname.toLowerCase().indexOf(filterValue) === 0);
  }
  sortbysortid(items: Pages[]) {
    items.sort((a, b) => (a.sortId > b.sortId) ? 1 : -1);
  }

  removedog(page, x) {
    page.splice(x, 1);

  }

  // drop(event: CdkDragDrop<any>) {
  //   moveItemInArray(this.groupedItems[event.container.data.key], event.previousIndex, event.currentIndex);
  //   var pages = event.container.data.value.map((p, index) => {
  //     let newpage: Pages = { sortId: index, pageName: p.pageName, dogsId: p.dogsId }
  //     return newpage
  //   });
  //   this.dogpagesService.putPagesByPage(event.container.data.key, pages).subscribe();

  // }
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

  buildadddogform(): FormGroup {
    return this.fb.group({
      dog: null
    });
  }

}

