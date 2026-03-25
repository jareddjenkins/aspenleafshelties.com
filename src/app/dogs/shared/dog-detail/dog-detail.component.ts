import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DOCUMENT, Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Inject } from '@angular/core';

import { Dog } from '../../model/dog';
import { DogsComponent } from '../dog-card/dogs.component';
import { DEFAULT_DOG_IMAGE_URL, getPreferredDogImage, isUsableDogImageUrl } from '../dog-image';

@Component({
  selector: 'app-dog-detail',
  templateUrl: './dog-detail.component.html',
  styleUrls: ['./dog-detail.component.css'],
  imports: [DogsComponent],
})
export class DogDetailComponent implements OnInit {
  @Input() dog: Dog | undefined;

  showInput = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private titleService: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.dog = this.route.snapshot.data['dog'];
    this.updateSeoForDog(this.dog);
  }

  goBack(): void {
    this.location.back();
  }

  public toggleInput() {
    this.showInput = !this.showInput;
  }

  private updateSeoForDog(dog: Dog | undefined) {
    if (!dog) {
      return;
    }

    const title = `${dog.rname || dog.cname} | Aspenleaf Shelties`;
    const description = `${dog.rname || dog.cname} at Aspenleaf Shelties in Dewy Rose, Georgia. View call name, pedigree details, birth date, and profile information.`;
    const preferredImage = getPreferredDogImage(dog, 'detail');
    const imageUrl = isUsableDogImageUrl(preferredImage) ? preferredImage : DEFAULT_DOG_IMAGE_URL;
    const canonicalUrl = this.document.location?.href?.split('#')[0].split('?')[0] || '';

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'profile' });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    if (imageUrl) {
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    }
  }
}
