import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location} from '@angular/common';

import { Dog } from '../../model/dog';
import { DogService } from 'src/app/dog.service';

@Component({
  selector: 'app-dog-detail',
  templateUrl: './dog-detail.component.html',
  styleUrls: ['./dog-detail.component.scss'],
})
export class DogDetailComponent implements OnInit {
  @Input() dog: Dog;

  showInput = false;

  constructor(
    private route: ActivatedRoute,
    private dogService: DogService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.getDog();
  }

  getDog(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.dogService.getDog(id).subscribe((dog) => (this.dog = dog));
  }

  goBack(): void {
    this.location.back();
  }

  public toggleInput() {
    this.showInput = !this.showInput;
  }
}
