import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Dog } from '../../model/dog';
import { DogStatus } from '../../model/dog';
import { DogService } from '../../../dog.service';
import { FirestoreAdminDataService } from '../../../firebase/firestore-admin-data.service';

@Component({
  selector: 'app-editdog',
  templateUrl: './editdog.component.html',
  styleUrls: ['./editdog.component.css'],
  standalone: false,
})
export class EditdogComponent implements OnInit {
  private static readonly CARD_IMAGE_SIZE = 640;
  private static readonly DETAIL_IMAGE_SIZE = 1400;
  private static readonly WEBP_QUALITY = 0.84;

  dog: Dog;
  //imagecropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageBlob: Blob | null = null;

  showInput = false;
  dogDob = '';
  cropFormat: 'jpeg' = 'jpeg';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dogService: DogService,
    private firestoreAdminDataService: FirestoreAdminDataService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.getDog();
  }

  getDog() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.dogService.getDog(id).subscribe((dog) => {
      this.dog = dog;
      this.dogDob = this.toDateInputValue(dog?.dob);
    });
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    this.router.navigate(['/admin']);
  }

  public toggleInput() {
    this.showInput = !this.showInput;
  }

  save() {
    this.syncDobFromInput();
    this.dog.sireId = null;
    this.dog.damId = null;
    this.firestoreAdminDataService.updateDog(this.dog).subscribe(); // => this.goBack());
  }

  onUpload() {
    if (!this.croppedImageBlob) {
      return;
    }

    Promise.all([
      this.resizeImageBlob(this.croppedImageBlob, EditdogComponent.CARD_IMAGE_SIZE),
      this.resizeImageBlob(this.croppedImageBlob, EditdogComponent.DETAIL_IMAGE_SIZE),
    ])
      .then(([cardImage, detailImage]) =>
        this.firestoreAdminDataService.uploadDogImage(this.dog.id, { card: cardImage, detail: detailImage }).subscribe(
          (uploadedImages) => {
            this.dog.profileCardImageUrl = uploadedImages.cardUrl;
            this.dog.profileDetailImageUrl = uploadedImages.detailUrl;
            this.dog.profileCardImagePath = uploadedImages.cardPath;
            this.dog.profileDetailImagePath = uploadedImages.detailPath;
            this.dog.profileImageUrl = uploadedImages.detailUrl;
          },
        ),
      )
      .catch((error) => {
        console.error(error);
        window.alert('Unable to prepare the image for upload.');
      });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl;
    this.croppedImageBlob = event.blob ?? null;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  updateDob(value: string) {
    this.dogDob = value;
    this.syncDobFromInput();
  }

  updateStatus(value: string) {
    this.dog.status = value === 'reserved' || value === 'sold' ? (value as DogStatus) : null;
  }

  private syncDobFromInput() {
    if (!this.dog || !this.dogDob) {
      return;
    }

    this.dog.dob = new Date(`${this.dogDob}T00:00:00`);
  }

  private toDateInputValue(value: Date | string | undefined): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().slice(0, 10);
  }

  private async resizeImageBlob(sourceImage: Blob, targetSize: number): Promise<Blob> {
    const image = await this.loadImage(sourceImage);
    const canvas = document.createElement('canvas');
    canvas.width = targetSize;
    canvas.height = targetSize;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to create image canvas.');
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, targetSize, targetSize);

    const resizedImage = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/webp', EditdogComponent.WEBP_QUALITY);
    });

    if (!resizedImage) {
      throw new Error('Unable to create resized image.');
    }

    return resizedImage;
  }

  private loadImage(sourceImage: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(sourceImage);
      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Unable to load image.'));
      };

      image.src = objectUrl;
    });
  }
}
