import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe, Location } from '@angular/common';

import { Dog } from './model/dog';
import { DEFAULT_DOG_IMAGE_URL, getPreferredDogImage, isUsableDogImageUrl } from './shared/dog-image';

@Component({
  selector: 'app-dogs',
  templateUrl: './dogs.component.html',
  styleUrls: ['./dogs.component.css'],
  imports: [DatePipe, CurrencyPipe],
  standalone: true,
})
export class DogsComponent implements OnChanges {
  @Input() dog: Dog;

  @Input() showStatusBanner = false;

  @Input() imageVariant: 'card' | 'detail' = 'card';

  @Input() prioritizeImage = false;

  @Input() showPrice = false;

  @Input() clickTarget: 'detail' | 'edit' | 'none' = 'detail';

  private imageLoadFailed = false;

  lgImgUrl: string;

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  handleCardClick(): void {
    if (!this.dog?.id || this.clickTarget === 'none') {
      return;
    }

    if (this.clickTarget === 'edit') {
      this.router.navigate([`/admin/editdog/${this.dog.id}`]);
      return;
    }

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

  get displayName(): string {
    return this.normalizedText(this.dog?.rname) || this.normalizedText(this.dog?.cname);
  }

  get imageAltText(): string {
    return this.displayName ? `Picture of ${this.displayName}` : 'Picture of dog';
  }

  get isCardInteractive(): boolean {
    return this.clickTarget !== 'none' && Boolean(this.dog?.id);
  }

  get callName(): string {
    return this.normalizedText(this.dog?.cname);
  }

  get sireName(): string {
    return this.normalizedText(this.dog?.sireName);
  }

  get damName(): string {
    return this.normalizedText(this.dog?.damName);
  }

  get comments(): string {
    return this.normalizedText(this.dog?.comments);
  }

  get hasDob(): boolean {
    if (!this.dog?.dob) {
      return false;
    }

    const date = this.dog.dob instanceof Date ? this.dog.dob : new Date(this.dog.dob);
    return !Number.isNaN(date.getTime());
  }

  handleImageError(): void {
    if (!this.imageLoadFailed) {
      this.imageLoadFailed = true;
    }
  }

  private normalizedText(value: string | null | undefined): string {
    return typeof value === 'string' ? value.trim() : '';
  }
}
