import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { ActivatedRoute, Router } from '@angular/router';

import { Dog } from '../../model/dog';
import { DogStatus } from '../../model/dog';
import { DogService } from '../../../dog.service';
import { FirestoreAdminDataService } from '../../../firebase/firestore-admin-data.service';
import { AdminHeaderBanner, AdminHeaderService } from '../admin-header.service';

@Component({
  selector: 'app-editdog',
  templateUrl: './editdog.component.html',
  styleUrls: ['./editdog.component.css'],
  standalone: false,
})
export class EditdogComponent implements OnInit, OnDestroy {
  private static readonly CARD_IMAGE_SIZE = 640;
  private static readonly DETAIL_IMAGE_SIZE = 1400;
  private static readonly WEBP_QUALITY = 0.84;
  private formBannerTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private savedSnapshot = '';

  dog: Dog;
  isDraft = false;
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
  formStatusMessage = '';
  formStatusTone: 'info' | 'success' | 'warning' | 'error' = 'info';
  imageStatusMessage = '';
  imageStatusTone: 'info' | 'success' | 'warning' | 'error' = 'info';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dogService: DogService,
    private firestoreAdminDataService: FirestoreAdminDataService,
    private adminHeaderService: AdminHeaderService,
  ) {}

  ngOnInit(): void {
    this.getDog();
  }

  ngOnDestroy(): void {
    this.clearFormBannerTimeout();
    this.adminHeaderService.clear();
  }

  getDog() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    if (id === 'new') {
      this.isDraft = true;
      this.dog = this.createDraftDog();
      this.dogDob = '';
      this.dogPrice = '';
      this.captureSavedSnapshot();
      this.markUnsavedChanges();
      this.imageStatusMessage = 'Save the dog record before uploading images.';
      this.imageStatusTone = 'warning';
      this.syncAdminHeader();
      return;
    }

    this.dogService.getDog(id).subscribe((dog) => {
      this.isDraft = false;
      this.dog = dog;
      this.dogDob = this.toDateInputValue(dog?.dob);
      this.dogPrice = this.toPriceInputValue(dog?.price);
      this.captureSavedSnapshot();
      this.syncAdminHeader();
    });
  }

  public toggleInput() {
    this.showInput = !this.showInput;
  }

  save() {
    this.syncDobFromInput();
    this.syncPriceFromInput();
    this.dog.sireId = null;
    this.dog.damId = null;

    const validationMessage = this.getValidationMessage();
    if (validationMessage) {
      this.formStatusMessage = validationMessage;
      this.formStatusTone = 'error';
      this.syncAdminHeader();
      return;
    }

    this.isSaving = true;
    this.restoreFormStatusBanner();
    this.syncAdminHeader();
    const saveRequest = this.isDraft
      ? this.firestoreAdminDataService.addDog(this.dog)
      : this.firestoreAdminDataService.updateDog(this.dog);

    saveRequest.subscribe({
      next: (savedDog) => {
        const wasDraft = this.isDraft;
        this.dog = savedDog;
        if (wasDraft) {
          this.isDraft = false;
          this.router.navigate(['/admin/editdog', savedDog.id], { replaceUrl: true });
          this.syncImageStatusBanner();
        }
        this.isSaving = false;
        this.captureSavedSnapshot();
        this.showTemporaryFormStatus(wasDraft ? 'Dog record created.' : 'Changes saved.', 'success');
        this.syncAdminHeader();
      },
      error: (error) => {
        console.error(error);
        this.isSaving = false;
        this.formStatusMessage = error instanceof Error ? error.message : 'Unable to save changes right now. Please try again.';
        this.formStatusTone = 'error';
        this.syncAdminHeader();
      },
    });
  }

  onUpload() {
    if (this.isDraft || !this.dog.id) {
      this.imageStatusMessage = 'Save the dog record before uploading images.';
      this.imageStatusTone = 'warning';
      this.syncAdminHeader();
      return;
    }

    if (!this.croppedImageBlob) {
      return;
    }

    this.isUploading = true;
    this.syncImageStatusBanner();
    this.syncAdminHeader();
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
            this.imageStatusMessage = 'Image uploaded and saved.';
            this.imageStatusTone = 'success';
            this.syncAdminHeader();
          },
          (error) => {
            console.error(error);
            this.isUploading = false;
            this.imageStatusMessage = 'Unable to upload the image right now. Please try again.';
            this.imageStatusTone = 'error';
            this.syncAdminHeader();
          },
        ),
      )
      .catch((error) => {
        console.error(error);
        this.isUploading = false;
        this.imageStatusMessage = 'Unable to prepare the image for upload.';
        this.imageStatusTone = 'error';
        this.syncAdminHeader();
      });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl;
    this.croppedImageBlob = event.blob ?? null;
    this.syncImageStatusBanner();
    this.syncAdminHeader();
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
    if (!this.isSaving) {
      if (this.hasUnsavedChanges) {
        this.formStatusMessage = 'You have unsaved changes.';
        this.formStatusTone = 'warning';
      } else {
        this.formStatusMessage = '';
      }
    }
    this.syncAdminHeader();
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

  private restoreFormStatusBanner() {
    this.clearFormBannerTimeout();
    if (this.isSaving) {
      this.formStatusMessage = 'Saving changes...';
      this.formStatusTone = 'info';
      this.syncAdminHeader();
      return;
    }

    if (this.hasUnsavedChanges) {
      this.formStatusMessage = 'You have unsaved changes.';
      this.formStatusTone = 'warning';
      this.syncAdminHeader();
      return;
    }

    this.formStatusMessage = '';
    this.syncAdminHeader();
  }

  private syncImageStatusBanner() {
    if (this.isDraft || !this.dog?.id) {
      this.imageStatusMessage = 'Save the dog record before uploading images.';
      this.imageStatusTone = 'warning';
      this.syncAdminHeader();
      return;
    }

    if (this.isUploading) {
      this.imageStatusMessage = 'Uploading image...';
      this.imageStatusTone = 'info';
      this.syncAdminHeader();
      return;
    }

    if (this.croppedImageBlob) {
      this.imageStatusMessage = 'Image is not saved until you click Upload Image.';
      this.imageStatusTone = 'warning';
      this.syncAdminHeader();
      return;
    }

    this.imageStatusMessage = '';
    this.syncAdminHeader();
  }

  private showTemporaryFormStatus(message: string, tone: 'success' | 'info', durationMs = 4000) {
    this.clearFormBannerTimeout();
    this.formStatusMessage = message;
    this.formStatusTone = tone;
    this.formBannerTimeoutId = setTimeout(() => {
      this.formBannerTimeoutId = null;
      this.restoreFormStatusBanner();
    }, durationMs);
  }

  private clearFormBannerTimeout() {
    if (this.formBannerTimeoutId !== null) {
      clearTimeout(this.formBannerTimeoutId);
      this.formBannerTimeoutId = null;
    }
  }

  private captureSavedSnapshot() {
    this.savedSnapshot = this.buildDogSnapshot();
    this.hasUnsavedChanges = false;
  }

  private syncAdminHeader(): void {
    const banners: AdminHeaderBanner[] = [];

    if (this.formStatusMessage) {
      banners.push({
        label: 'Record',
        message: this.formStatusMessage,
        tone: this.formStatusTone,
      });
    }

    if (this.imageStatusMessage) {
      banners.push({
        label: 'Images',
        message: this.imageStatusMessage,
        tone: this.imageStatusTone,
      });
    }

    this.adminHeaderService.setState({
      title: this.isDraft ? 'Create Dog Record' : 'Edit Dog',
      subtitle: this.isDraft ? '' : 'Update the public details for this dog.',
      primaryAction: () => this.save(),
      primaryActionBusy: this.isSaving,
      primaryActionDisabled: this.isSaving,
      primaryActionLabel: 'Save',
      primaryActionPendingLabel: 'Saving...',
      banners,
    });
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
      gender: this.dog?.gender ?? null,
      status: this.dog?.status ?? null,
      dob: this.dogDob ?? '',
      price: this.dogPrice ?? '',
      sireName: this.dog?.sireName ?? '',
      damName: this.dog?.damName ?? '',
      comments: this.dog?.comments ?? '',
    });
  }

  get showRnameError(): boolean {
    return this.formStatusTone === 'error' && !this.dog?.rname?.trim();
  }

  get showCnameError(): boolean {
    return this.formStatusTone === 'error' && !this.dog?.cname?.trim();
  }

  get showGenderError(): boolean {
    return this.formStatusTone === 'error' && this.dog?.gender !== true && this.dog?.gender !== false;
  }

  private getValidationMessage(): string {
    if (!this.dog?.rname?.trim()) {
      return 'Registered name is required.';
    }

    if (!this.dog?.cname?.trim()) {
      return 'Call name is required.';
    }

    if (this.dog?.gender !== true && this.dog?.gender !== false) {
      return 'Gender is required.';
    }

    return '';
  }

  private createDraftDog(): Dog {
    return {
      id: '',
      rname: '',
      cname: '',
      comments: '',
      dob: null,
      damId: null,
      damName: '',
      sireId: null,
      sireName: '',
      gender: null,
      price: null,
      profileImageUrl: '',
      profileCardImageUrl: '',
      profileDetailImageUrl: '',
      profileCardImagePath: null,
      profileDetailImagePath: null,
      status: null,
    };
  }
}
