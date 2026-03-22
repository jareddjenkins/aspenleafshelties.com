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
  dog: Dog;
  sires: Dog[];
  dams: Dog[];
  selectedSire: Dog = null;
  selectedDam: Dog = null;
  //imagecropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageBlob: any = '';

  showInput = false;
  dogDob = '';
  cropFormat: 'png' | 'jpeg' = 'jpeg';

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
    const id = +this.route.snapshot.paramMap.get('id');
    this.dogService.getDog(id).subscribe((dog) => {
      this.dog = dog;
      this.dogDob = this.toDateInputValue(dog?.dob);
      this.getDams();
      this.getSires();
    });
  }

  getSires() {
    this.dogService.getMaleDogs().subscribe((dogs) => {
      ((this.sires = dogs),
        (this.selectedSire = this.sires.find(
          (dog) => dog.id == this.dog.sireId,
        )));
    });
  }

  getDams() {
    this.dogService.getFemaleDogs().subscribe((dogs) => {
      ((this.dams = dogs),
        (this.selectedDam = this.dams.find((dog) => dog.id == this.dog.damId)));
    });
  }

  setSire() {
    this.dog.sireId = this.selectedSire.id;
    this.dog.sireName = this.selectedSire.rname;
  }

  setDam() {
    this.dog.damId = this.selectedDam.id;
    this.dog.damName = this.selectedDam.rname;
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
    this.firestoreAdminDataService.updateDog(this.dog).subscribe(); // => this.goBack());
  }

  onUpload() {
    if (!this.croppedImageBlob) {
      return;
    }

    this.firestoreAdminDataService
      .uploadDogImage(this.dog.id, this.croppedImageBlob)
      .subscribe((x) => (this.dog.profileImageUrl = x));
  }

  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  fileChangeEvent(event: any): void {
    const selectedFile = event?.target?.files?.[0] as File | undefined;
    this.cropFormat = selectedFile?.type === 'image/png' ? 'png' : 'jpeg';
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl;
    this.croppedImageBlob = event.blob;
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
}
