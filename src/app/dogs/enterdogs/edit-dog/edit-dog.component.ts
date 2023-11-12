import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, tap } from 'rxjs';
import { DogService } from 'src/app/shared/dog.service';
import { Dog } from 'src/app/shared/model';

@Component({
  selector: 'app-edit-dog',
  templateUrl: './edit-dog.component.html',
  styleUrls: ['./edit-dog.component.scss'],
})
export class EditDogComponent {
  dog!: Dog;
  sires!: Dog[];
  dams!: Dog[];
  selectedSire!: Dog;
  selectedDam!: Dog;
  form!: FormGroup;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageBlob: any = '';

  showInput = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dogService: DogService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.dogService.fetchDogs();
    this.activatedRoute.data.subscribe(
      ({dog}) => {
        this.buildForm(dog)
      });
}



    // this.dogService.getMaleDogs().subscribe(maleDogs => this.sires = maleDogs)
    // this.dogService.getFemaleDogs().subscribe(femaleDogs => this.sires = femaleDogs)

  
  buildForm(dog: Dog){
    this.form = this.fb.group({
      cname: [dog.cname],
      rname: [dog.rname],
      comments: [dog.comments],
      dob: [dog.dob],
      sire: [dog.sireName],
      dam:  [dog.damName]
    })
  }

  setSire() {
    // this.dog.sireId = this.selectedSire.id;
    // this.dog.sireName = this.selectedSire.rname;
  }

  setDam() {
    // this.dog.damId = this.selectedDam.id;
    // this.dog.damName = this.selectedDam.rname;
  }

  goBack(): void {
    // this.location.back();
  }

  public toggleInput() {
    this.showInput = !this.showInput;
  }

  save() {
    // this.dogService.updateDog(this.dog).subscribe(); // => this.goBack());
  }

  onUpload() {
    // this.dogService
    //   .uploadDogImage(this.dog.id, this.croppedImageBlob)
    //   .subscribe((x) => (this.dog.profileImageUrl = x));
  }


  fileChangeEvent(event: any): void {
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
}

