import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Location, CurrencyPipe, DatePipe } from '@angular/common';

import { Dog } from '../../model/dog';
import { DEFAULT_DOG_IMAGE_URL, getPreferredDogImage, isUsableDogImageUrl } from '../dog-image';

@Component({
  selector: 'app-dogs',
  templateUrl: './dogs.component.html',
  styleUrls: ['./dogs.component.css'],
  imports: [DatePipe, CurrencyPipe],
})
export class DogsComponent implements OnChanges {
  @Input()
  dog: Dog;

  @Input()
  showStatusBanner = false;

  @Input()
  imageVariant: 'card' | 'detail' = 'card';

  @Input()
  prioritizeImage = false;

  @Input()
  showPrice = false;

  private imageLoadFailed = false;

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

  ngOnChanges(): void {
    this.imageLoadFailed = false;
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
    const preferredImage = getPreferredDogImage(this.dog, this.imageVariant);

    if (this.imageLoadFailed || !isUsableDogImageUrl(preferredImage)) {
      return DEFAULT_DOG_IMAGE_URL;
    }

    return preferredImage;
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

  get hasPrice(): boolean {
    return this.showPrice && typeof this.dog?.price === 'number' && Number.isFinite(this.dog.price);
  }

  handleImageError(): void {
    if (!this.imageLoadFailed) {
      this.imageLoadFailed = true;
    }
  }
}
