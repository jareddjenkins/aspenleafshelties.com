import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Dog } from './model/dog';

@Component({
    selector: 'app-dogs',
    templateUrl: './dogs.component.html',
    styleUrls: ['./dogs.component.css'],
    standalone: false
})
export class DogsComponent {
  @Input() dog: Dog;

  @Input() showStatusBanner = false;

  @Input() imageVariant: 'card' | 'detail' = 'card';

  @Input() prioritizeImage = false;

  lgImgUrl: string;

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  goDogDetails(): void {
    this.router.navigate([`/detail/${this.dog.id}`]);
  }
  goBack(): void {
    this.location.back();
  }

  get statusLabel(): string | null {
    if (this.dog?.status === 'reserved') {
      return 'Reserved';
    }

    if (this.dog?.status === 'sold') {
      return 'Sold';
    }

    return null;
  }

  get imageUrl(): string {
    if (this.imageVariant === 'detail') {
      return this.dog?.profileDetailImageUrl || this.dog?.profileCardImageUrl || this.dog?.profileImageUrl || '';
    }

    return this.dog?.profileCardImageUrl || this.dog?.profileDetailImageUrl || this.dog?.profileImageUrl || '';
  }

  get imageLoading(): 'eager' | 'lazy' {
    return this.prioritizeImage || this.imageVariant === 'detail' ? 'eager' : 'lazy';
  }

  get imageDecoding(): 'sync' | 'async' {
    return this.prioritizeImage || this.imageVariant === 'detail' ? 'sync' : 'async';
  }

  get imageFetchPriority(): 'high' | null {
    return this.prioritizeImage ? 'high' : null;
  }
}
