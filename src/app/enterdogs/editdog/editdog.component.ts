import { Component, OnInit, Input, Injectable } from '@angular/core';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dog } from '../../dog';
import { DogService } from '../../dog.service';

@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {

  fromModel(date: Date): NgbDateStruct {
    return (date && date.getFullYear) ? {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()} : null;
  }

  toModel(date: NgbDateStruct): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }
}

@Component({
  selector: 'app-editdog',
  templateUrl: './editdog.component.html',
  styleUrls: ['./editdog.component.css'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})

export class EditdogComponent implements OnInit {
  dog: Dog;
  sires: Dog[];
  dams: Dog[];
  selectedSire: Dog = null;
  selectedDam: Dog  = null;

  showInput = false;

  constructor(
    private route: ActivatedRoute,
    private dogService: DogService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.getDog()
  }

  getDog() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.dogService.getDog(id)
      .subscribe(dog => { this.dog = dog,
      this.getDams(),
      this.getSires()
      });
  }
  
  getSires() {
    this.dogService.getMaleDogs()
      .subscribe(dogs => {
        this.sires = dogs,
        this.selectedSire =  this.sires.find(dog => dog.id == this.dog.sireId);
      });
  }

  getDams() {
    this.dogService.getFemaleDogs()
      .subscribe(dogs => {
        this.dams = dogs,
        this.selectedDam =  this.dams.find(dog => dog.id == this.dog.damId);
      });
  }
  
  setSire(){
    this.dog.sireId = this.selectedSire.id;
    this.dog.sireName = this.selectedSire.rname;
  }

  setDam(){
    this.dog.damId = this.selectedDam.id;
    this.dog.damName = this.selectedDam.rname;
  }
  
  goBack(): void {
    this.location.back();
  }

  public toggleInput() {
    this.showInput = !this.showInput;
  }

  save(){
    this.dogService.updateDog(this.dog)
      .subscribe();// => this.goBack());
  }

}
