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
  private bannerTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private savedSnapshot = '';

  dog: Dog;
  //imagecropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageBlob: Blob | null = null;

  showInput = false;
  dogDob = '';
  dogPrice = '';
  cropFormat: 'jpeg' = 'jpeg';
  hasUnsavedChanges = false;
  isSaving = false;
  isUploading = false;
  statusMessage = '';
  statusTone: 'info' | 'success' | 'warning' | 'error' = 'info';

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
      this.dogPrice = this.toPriceInputValue(dog?.price);
      this.captureSavedSnapshot();
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
    this.syncPriceFromInput();
    this.dog.sireId = null;
    this.dog.damId = null;
    this.isSaving = true;
    this.restoreStatusBanner();
    this.firestoreAdminDataService.updateDog(this.dog).subscribe({
      next: () => {
        this.isSaving = false;
        this.captureSavedSnapshot();
        this.showTemporaryStatus('Changes saved.', 'success');
      },
      error: (error) => {
        console.error(error);
        this.isSaving = false;
        this.statusMessage = 'Unable to save changes right now. Please try again.';
        this.statusTone = 'error';
      },
    });
  }

  onUpload() {
    if (!this.croppedImageBlob) {
      return;
    }

    this.isUploading = true;
    this.restoreStatusBanner();
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
            this.isUploading = false;
            this.showTemporaryStatus('Image uploaded and saved.', 'success');
          },
          (error) => {
            console.error(error);
            this.isUploading = false;
            this.statusMessage = 'Unable to upload the image right now. Please try again.';
            this.statusTone = 'error';
          },
        ),
      )
      .catch((error) => {
        console.error(error);
        this.isUploading = false;
        this.statusMessage = 'Unable to prepare the image for upload.';
        this.statusTone = 'error';
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
    this.markUnsavedChanges();
  }

  updateStatus(value: string) {
    this.dog.status = value === 'reserved' || value === 'sold' ? (value as DogStatus) : null;
    this.markUnsavedChanges();
  }

  updatePrice(value: string | number | null) {
    this.dogPrice = value == null ? '' : String(value);
    this.syncPriceFromInput();
    this.markUnsavedChanges();
  }

  markUnsavedChanges() {
    this.hasUnsavedChanges = this.buildDogSnapshot() !== this.savedSnapshot;
    if (!this.isSaving && !this.isUploading) {
      if (this.hasUnsavedChanges) {
        this.statusMessage = 'You have unsaved changes.';
        this.statusTone = 'warning';
      } else {
        this.statusMessage = '';
      }
    }
  }

  private syncDobFromInput() {
    if (!this.dog) {
      return;
    }

    if (!this.dogDob) {
      this.dog.dob = null;
      return;
    }

    const parsedDate = new Date(`${this.dogDob}T00:00:00`);
    this.dog.dob = Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
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

  private restoreStatusBanner() {
    this.clearBannerTimeout();

    if (this.isSaving) {
      this.statusMessage = 'Saving changes...';
      this.statusTone = 'info';
      return;
    }

    if (this.isUploading) {
      this.statusMessage = 'Uploading image...';
      this.statusTone = 'info';
      return;
    }

    if (this.hasUnsavedChanges) {
      this.statusMessage = 'You have unsaved changes.';
      this.statusTone = 'warning';
      return;
    }

    this.statusMessage = '';
  }

  private showTemporaryStatus(message: string, tone: 'success' | 'info', durationMs = 4000) {
    this.clearBannerTimeout();
    this.statusMessage = message;
    this.statusTone = tone;
    this.bannerTimeoutId = setTimeout(() => {
      this.bannerTimeoutId = null;
      this.restoreStatusBanner();
    }, durationMs);
  }

  private clearBannerTimeout() {
    if (this.bannerTimeoutId !== null) {
      clearTimeout(this.bannerTimeoutId);
      this.bannerTimeoutId = null;
    }
  }

  private captureSavedSnapshot() {
    this.savedSnapshot = this.buildDogSnapshot();
    this.hasUnsavedChanges = false;
  }

  private syncPriceFromInput() {
    if (!this.dog) {
      return;
    }

    const normalizedValue = String(this.dogPrice ?? '').trim();
    if (!normalizedValue) {
      this.dog.price = null;
      return;
    }

    const parsedPrice = Number(normalizedValue);
    this.dog.price = Number.isFinite(parsedPrice) ? parsedPrice : null;
  }

  private toPriceInputValue(value: number | null | undefined): string {
    return typeof value === 'number' && Number.isFinite(value) ? String(value) : '';
  }

  private buildDogSnapshot(): string {
    return JSON.stringify({
      rname: this.dog?.rname ?? '',
      cname: this.dog?.cname ?? '',
      gender: this.dog?.gender ?? false,
      status: this.dog?.status ?? null,
      dob: this.dogDob ?? '',
      price: this.dogPrice ?? '',
      sireName: this.dog?.sireName ?? '',
      damName: this.dog?.damName ?? '',
      comments: this.dog?.comments ?? '',
    });
  }
}
