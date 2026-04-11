import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { firstValueFrom } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { Dog } from '../../model/dog';
import { DogStatus } from '../../model/dog';
import { DogService } from '../../../dog.service';
import { DogpagesService } from '../../../dogpages.service';
import { FirestoreAdminDataService } from '../../../firebase/firestore-admin-data.service';
import { AdminHeaderAction, AdminHeaderBanner, AdminHeaderService } from '../admin-header.service';
import { DogsComponent } from '../../dogs.component';

type EditDogSection = 'details' | 'image' | 'preview' | 'delete';

@Component({
  selector: 'app-editdog',
  templateUrl: './editdog.component.html',
  styleUrls: ['./editdog.component.css'],
  imports: [
    DatePipe,
    DogsComponent,
    FormsModule,
    ImageCropperComponent,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  standalone: true,
})
export class EditdogComponent implements OnInit, OnDestroy {
  private static readonly CARD_IMAGE_SIZE = 640;
  private static readonly DETAIL_IMAGE_SIZE = 1400;
  private static readonly WEBP_QUALITY = 0.84;
  readonly pageOptions = [
    { value: 'boys', label: 'Boys' },
    { value: 'girls', label: 'Girls' },
    { value: 'showavailable', label: 'Show Puppies' },
    { value: 'available', label: 'Companion Puppies' },
    { value: 'adultavailable', label: 'Adults' },
  ] as const;
  private readonly mobileMediaQueryString = '(max-width: 700px)';
  private formBannerTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private imageBannerTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private mobileMediaQuery: MediaQueryList | null = null;
  private readonly mobileMediaQueryListener = (event: MediaQueryListEvent) => this.applyMobileSectionState(event.matches);
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
  activePageNames: string[] = [];
  selectedPageNames: string[] = [];
  hasUnsavedChanges = false;
  isSaving = false;
  isDeleting = false;
  isUploading = false;
  isMobileViewport = false;
  formStatusMessage = '';
  formStatusTone: 'info' | 'success' | 'warning' | 'error' = 'info';
  imageStatusMessage = '';
  imageStatusTone: 'info' | 'success' | 'warning' | 'error' = 'info';
  sectionExpanded: Record<EditDogSection, boolean> = {
    details: true,
    image: true,
    preview: true,
    delete: true,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dogService: DogService,
    private dogpagesService: DogpagesService,
    private firestoreAdminDataService: FirestoreAdminDataService,
    private adminHeaderService: AdminHeaderService,
  ) {}

  ngOnInit(): void {
    this.initializeMobileSectionState();
    this.getDog();
  }

  ngOnDestroy(): void {
    this.clearFormBannerTimeout();
    this.clearImageBannerTimeout();
    this.destroyMobileSectionState();
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
      this.resetMobileSectionExpansion();
      this.dogDob = '';
      this.dogPrice = '';
      this.selectedPageNames = [];
      this.captureSavedSnapshot();
      this.markUnsavedChanges();
      this.imageStatusMessage = 'Save the dog record before uploading images.';
      this.imageStatusTone = 'warning';
      this.activePageNames = [];
      this.syncAdminHeader();
      return;
    }

    this.dogService.getDog(id).subscribe((dog) => {
      this.isDraft = false;
      this.dog = dog;
      this.dogDob = this.toDateInputValue(dog?.dob);
      this.dogPrice = this.toPriceInputValue(dog?.price);
      this.captureSavedSnapshot();
      this.loadActivePages(dog?.id);
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
    this.selectedPageNames = this.getAllowedSelectedPageNames();

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
      next: async (savedDog) => {
        const wasDraft = this.isDraft;
        try {
          await this.persistPageAssignments(savedDog.id);
          this.dog = savedDog;
          this.activePageNames = this.getSelectedPageDisplayNames();
          if (wasDraft) {
            this.isDraft = false;
            this.router.navigate(['/admin/editdog', savedDog.id], { replaceUrl: true });
            this.syncImageStatusBanner();
          }
          this.isSaving = false;
          this.captureSavedSnapshot();
          this.showTemporaryFormStatus(wasDraft ? 'Dog record created.' : 'Changes saved.', 'success');
          this.syncAdminHeader();
        } catch (error) {
          console.error(error);
          this.isSaving = false;
          this.formStatusMessage = error instanceof Error ? error.message : 'Dog saved, but page assignments could not be updated.';
          this.formStatusTone = 'error';
          this.syncAdminHeader();
        }
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

  deleteDogRecord(): void {
    if (this.isDraft || !this.dog?.id || this.isDeleting) {
      return;
    }

    if (!this.canDeleteDog) {
      window.alert(this.deleteDisabledReason);
      return;
    }

    const dogName = this.dog.rname || this.dog.cname || `Dog ${this.dog.id}`;
    const confirmed = window.confirm(`Delete ${dogName}? This permanently removes the dog record.`);
    if (!confirmed) {
      return;
    }

    this.isDeleting = true;
    this.formStatusMessage = 'Deleting dog record...';
    this.formStatusTone = 'warning';
    this.syncAdminHeader();

    this.firestoreAdminDataService.deleteDog(this.dog.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.router.navigate(['/admin']);
      },
      error: (error: Error) => {
        this.isDeleting = false;
        this.formStatusMessage = error.message || 'Unable to delete this dog right now.';
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
            this.imageChangedEvent = '';
            this.croppedImage = '';
            this.croppedImageBlob = null;
            this.showTemporaryImageStatus('Image uploaded and saved.', 'success');
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

  updateGender(value: boolean | null) {
    this.dog.gender = value === true || value === false ? value : null;
    this.selectedPageNames = this.getAllowedSelectedPageNames(true);
    this.markUnsavedChanges();
  }

  updatePrice(value: string | number | null) {
    this.dogPrice = value == null ? '' : String(value);
    this.syncPriceFromInput();
    this.markUnsavedChanges();
  }

  isPageSelected(pageName: string): boolean {
    return this.selectedPageNames.includes(pageName);
  }

  isPageSelectionDisabled(pageName: string): boolean {
    return this.isPageSelectionBlocked(pageName) && !this.isPageSelected(pageName);
  }

  isSectionCollapsed(section: EditDogSection): boolean {
    return this.isMobileViewport && !this.sectionExpanded[section];
  }

  toggleSection(section: EditDogSection): void {
    if (!this.isMobileViewport) {
      return;
    }

    this.sectionExpanded = {
      ...this.sectionExpanded,
      [section]: !this.sectionExpanded[section],
    };
  }

  onPageSelectionChange(pageName: string, checked: boolean): void {
    if (checked && this.isPageSelectionBlocked(pageName)) {
      return;
    }

    this.selectedPageNames = checked
      ? [...this.selectedPageNames, pageName]
      : this.selectedPageNames.filter((selectedPageName) => selectedPageName !== pageName);
    this.selectedPageNames = this.pageOptions
      .map((page) => page.value)
      .filter((page) => this.selectedPageNames.includes(page));
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
    this.clearImageBannerTimeout();

    if (this.isDraft || !this.dog?.id) {
      this.imageStatusMessage = '';
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

  private showTemporaryImageStatus(message: string, tone: 'success' | 'info', durationMs = 4000) {
    this.clearImageBannerTimeout();
    this.imageStatusMessage = message;
    this.imageStatusTone = tone;
    this.syncAdminHeader();
    this.imageBannerTimeoutId = setTimeout(() => {
      this.imageBannerTimeoutId = null;
      this.syncImageStatusBanner();
    }, durationMs);
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

  private clearImageBannerTimeout() {
    if (this.imageBannerTimeoutId !== null) {
      clearTimeout(this.imageBannerTimeoutId);
      this.imageBannerTimeoutId = null;
    }
  }

  private captureSavedSnapshot() {
    this.savedSnapshot = this.buildDogSnapshot();
    this.hasUnsavedChanges = false;
  }

  private syncAdminHeader(): void {
    const actions: AdminHeaderAction[] = [];
    const banners: AdminHeaderBanner[] = [];
    const hasPendingSave = this.isSaving || this.hasUnsavedChanges;
    const hasPendingUpload = this.isUploading || (!!this.croppedImageBlob && !this.isDraft);

    if (hasPendingSave) {
      actions.push({
        label: 'Save',
        pendingLabel: 'Saving...',
        disabled: this.isSaving || this.isDeleting,
        busy: this.isSaving,
        handler: () => this.save(),
      });
    }

    if (hasPendingUpload) {
      actions.push({
        label: 'Upload Image',
        pendingLabel: 'Uploading...',
        disabled: this.isUploading || this.isDeleting,
        busy: this.isUploading,
        handler: () => this.onUpload(),
      });
    }

    if (this.formStatusMessage && (hasPendingSave || this.formStatusTone === 'error' || this.formStatusTone === 'info')) {
      banners.push({
        label: 'Record',
        message: this.formStatusMessage,
        tone: this.formStatusTone,
      });
    }

    if (this.imageStatusMessage && (hasPendingUpload || this.imageStatusTone === 'error' || this.imageStatusTone === 'info')) {
      banners.push({
        label: 'Images',
        message: this.imageStatusMessage,
        tone: this.imageStatusTone,
      });
    }

    if (actions.length === 0 && banners.length === 0) {
      this.adminHeaderService.clear();
      return;
    }

    this.adminHeaderService.setState({ actions, banners });
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
      pageNames: this.selectedPageNames,
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

  get canDeleteDog(): boolean {
    return this.activePageNames.length === 0;
  }

  get deleteDisabledReason(): string {
    return this.activePageNames.length > 0
      ? `This dog cannot be deleted because it is still on these pages: ${this.activePageNames.join(', ')}.`
      : 'Delete dog record';
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

  private loadActivePages(dogId: string | undefined): void {
    if (!dogId) {
      this.activePageNames = [];
      this.selectedPageNames = [];
      this.captureSavedSnapshot();
      return;
    }

    this.dogpagesService.getDogPages().subscribe((pages) => {
      this.activePageNames = pages
        .filter((page) => page.dogId === dogId)
        .map((page) => this.toDisplayPageName(page.pageName))
        .filter((pageName, index, allPageNames) => allPageNames.indexOf(pageName) === index)
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
      this.selectedPageNames = this.pageOptions
        .map((page) => page.value)
        .filter((pageName) =>
          pages.some(
            (page) => page.dogId === dogId && this.normalizePageName(page.pageName) === pageName,
          ),
        );
      this.captureSavedSnapshot();
      this.syncAdminHeader();
    });
  }

  private async persistPageAssignments(dogId: string): Promise<void> {
    const allPages = await firstValueFrom(this.dogpagesService.getDogPages());
    const pageUpdates = this.pageOptions.map((pageOption) => {
      const existingAssignments = allPages.filter(
        (page) => this.normalizePageName(page.pageName) === pageOption.value,
      );
      const wantsPage = this.selectedPageNames.includes(pageOption.value);
      const alreadyOnPage = existingAssignments.some((page) => page.dogId === dogId);

      if (wantsPage === alreadyOnPage) {
        return null;
      }

      const updatedAssignments = wantsPage
        ? [...existingAssignments, { dogId, pageName: pageOption.value, sortId: existingAssignments.length }]
        : existingAssignments.filter((page) => page.dogId !== dogId);

      return firstValueFrom(
        this.firestoreAdminDataService.putPagesByPage(
          pageOption.value,
          updatedAssignments.map((page, index) => ({
            ...page,
            sortId: index,
          })),
        ),
      );
    });

    await Promise.all(pageUpdates.filter((update): update is Promise<void> => Boolean(update)));
  }

  private getSelectedPageDisplayNames(): string[] {
    return this.pageOptions
      .filter((page) => this.selectedPageNames.includes(page.value))
      .map((page) => page.label);
  }

  private toDisplayPageName(value: string): string {
    const normalized = (value ?? '').trim().toLowerCase();

    switch (normalized) {
      case 'showavailable':
        return 'Show Puppies';
      case 'adultavailable':
        return 'Adults';
      case 'available':
        return 'Companion Puppies';
      case 'boys':
        return 'Boys';
      case 'girls':
        return 'Girls';
      default:
        return value;
    }
  }

  private normalizePageName(value: string): string {
    return (value ?? '').replace(/\s+/g, '').toLowerCase();
  }

  private initializeMobileSectionState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.mobileMediaQuery = window.matchMedia(this.mobileMediaQueryString);
    this.applyMobileSectionState(this.mobileMediaQuery.matches);

    if (typeof this.mobileMediaQuery.addEventListener === 'function') {
      this.mobileMediaQuery.addEventListener('change', this.mobileMediaQueryListener);
      return;
    }

    this.mobileMediaQuery.addListener(this.mobileMediaQueryListener);
  }

  private destroyMobileSectionState(): void {
    if (!this.mobileMediaQuery) {
      return;
    }

    if (typeof this.mobileMediaQuery.removeEventListener === 'function') {
      this.mobileMediaQuery.removeEventListener('change', this.mobileMediaQueryListener);
      return;
    }

    this.mobileMediaQuery.removeListener(this.mobileMediaQueryListener);
  }

  private applyMobileSectionState(isMobileViewport: boolean): void {
    const wasMobileViewport = this.isMobileViewport;
    this.isMobileViewport = isMobileViewport;

    if (!isMobileViewport || wasMobileViewport) {
      return;
    }

    this.resetMobileSectionExpansion();
  }

  private resetMobileSectionExpansion(): void {
    if (!this.isMobileViewport) {
      return;
    }

    this.sectionExpanded = {
      details: this.isDraft,
      image: false,
      preview: true,
      delete: true,
    };
  }

  private getAllowedSelectedPageNames(allowUnknownGender = false): string[] {
    return this.selectedPageNames.filter((pageName) => !this.isPageSelectionBlocked(pageName, allowUnknownGender));
  }

  private isPageSelectionBlocked(pageName: string, allowUnknownGender = false): boolean {
    const normalizedPageName = this.normalizePageName(pageName);

    if (normalizedPageName !== 'boys' && normalizedPageName !== 'girls') {
      return false;
    }

    if (this.dog?.gender !== true && this.dog?.gender !== false) {
      return !allowUnknownGender;
    }

    return normalizedPageName === 'boys' ? this.dog.gender === false : this.dog.gender === true;
  }
}
