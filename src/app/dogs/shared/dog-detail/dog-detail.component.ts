import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location, NgIf } from '@angular/common';

import { Dog } from '../../model/dog';
import { DogService } from '../../../dog.service';
import { DogsComponent } from '../dog-card/dogs.component';

@Component({
    selector: 'app-dog-detail',
    templateUrl: './dog-detail.component.html',
    styleUrls: ['./dog-detail.component.css'],
    standalone: true,
    imports: [NgIf, DogsComponent]
})
export class DogDetailComponent implements OnInit {
  @Input() dog: Dog;

  showInput = false;

  constructor(
    private route: ActivatedRoute,
    private dogService: DogService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getDog();
  }

  getDog(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.dogService.getDog(id)
      .subscribe(dog => this.dog = dog);
  }

  goBack(): void {
    this.location.back();
  }

  public toggleInput() {
    this.showInput = !this.showInput;
  }
}
