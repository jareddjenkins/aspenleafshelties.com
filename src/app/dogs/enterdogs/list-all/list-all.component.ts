import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { DogService } from 'src/app/shared/dog.service';
import { Dog } from 'src/app/shared/model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-list-all',
  templateUrl: './list-all.component.html',
  styleUrls: ['./list-all.component.scss']
})
export class ListAllComponent implements OnInit {
  filteredDogs$!: Observable<Dog[]>
  displayedColumns: string[] = ['rname', 'cname', 'gender', 'sireName', 'damName', 'dob', 'edit'];
  filterControl = new FormControl("")
  constructor(
    private dogService: DogService,
    private responsive: BreakpointObserver
  ) { }

  ngOnInit() {
    this.responsive.observe(Breakpoints.Tablet)
      .subscribe(result => {
        if (result.matches) {
          this.displayedColumns = ['rname', 'cname', 'edit'];
        }
      });
    this.dogService.fetchDogs();
    this.filteredDogs$ = combineLatest([
      this.dogService.dogs$,
      this.filterControl.valueChanges.pipe(
        startWith(''),
        map(v => v || ''))
    ]).pipe(
      map(([dogs, filterString]) => {
        return this.filterDogs(dogs, filterString, this.displayedColumns)
      }))
  }

  createnewdog() {

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    //this.filterControl.;
  }

  filterDogs(dogs: Dog[], filterString: string, columns: string[]): Dog[] {
    if (!filterString) {
      return dogs
    }
    const lowerCaseFilter = filterString.toLocaleLowerCase()
    return dogs.filter(dog => {
      const filteredValues = Object.entries(dog)
        .filter(([k, v]) => columns.includes(k) && typeof v === "string")
        .map(([_k, v]) => v.toLowerCase())
        .join(' ')
      return filteredValues.includes(lowerCaseFilter)
    })
  }
}
