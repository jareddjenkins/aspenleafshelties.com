import { Component, OnInit } from '@angular/core';
import { DogpagesService } from '../../dogpages.service'
import { DogService } from '../../dog.service'
import { Observable, of, forkJoin } from 'rxjs';
import { Pages } from '../../pages';
import { map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-editpages',
  templateUrl: './editpages.component.html',
  styleUrls: ['./editpages.component.css']
})
export class EditpagesComponent implements OnInit {
  pages: Observable<Pages[]>;
  groupedItems;
  constructor(private dogpagesService: DogpagesService, private dogService: DogService) { }

  ngOnInit() {
    const groupBy = (items, key) => items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [
          ...(result[item[key]] || []),
          item,
        ],
      }),
      {},
    );

    let dogs = this.dogService.getDogs()
    let pages = this.dogpagesService.getDogPages()

    forkJoin(pages, dogs).subscribe(results => {
      results[0].map(page => page["dogObject"] = results[1].filter(x => page.dogsId == x.id)[0])
      this.groupedItems = groupBy(results[0], 'pageName')
      console.log(this.groupedItems)
    })



  }
  sortbysortid (items){
    items.sort((a, b) => (a.sortId > b.sortId) ? 1 : -1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.groupedItems[event.container.data.key], event.previousIndex, event.currentIndex);
    var x = event.container.data.value.map((p,index) => {
      let newpage: Pages = {sortId: index, pageName: p.pageName, dogsId: p.dogsId }
      return newpage
    });
    this.updatePage(event.container.data.key,x)

  }
  updatePage(pageName, pages) {
    this.dogpagesService.putPagesByPage(pageName, pages).subscribe()


  }
}