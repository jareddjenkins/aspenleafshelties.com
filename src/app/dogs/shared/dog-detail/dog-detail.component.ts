import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

import { Dog } from '../../model/dog';
import { DogService } from 'src/app/dog.service';
import { DogsComponent } from '../dog-card/dogs.component';

@Component({
  selector: 'app-dog-detail',
  templateUrl: './dog-detail.component.html',
  styleUrls: ['./dog-detail.component.css'],
  imports: [DogsComponent],
})
export class DogDetailComponent implements OnInit {
  @Input() dog: Dog;

  showInput = false;

  constructor(
    private route: ActivatedRoute,
    private dogService: DogService,
    private location: Location,
    private titleService: Title,
    private meta: Meta,
  ) {}

  ngOnInit(): void {
    this.getDog();
  }

  getDog(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.dogService.getDog(id).subscribe((dog) => {
      this.dog = dog;
      this.updateSeoForDog(dog);
    });
  }

  goBack(): void {
    this.location.back();
  }

  public toggleInput() {
    this.showInput = !this.showInput;
  }

  private updateSeoForDog(dog: Dog) {
    if (!dog) {
      return;
    }

    const title = `${dog.rname || dog.cname} | Aspenleaf Shelties`;
    const description = `${dog.rname || dog.cname} at Aspenleaf Shelties in Dewy Rose, Georgia. View call name, pedigree details, birth date, and profile information.`;

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
  }
}
