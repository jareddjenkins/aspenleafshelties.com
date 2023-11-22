import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { Observable, combineLatest, first, forkJoin, map, tap } from 'rxjs';
import { DogService } from 'src/app/shared/dog.service';
import { Dog } from 'src/app/shared/model';

@Component({
  selector: 'app-edit-dog',
  templateUrl: './edit-dog.component.html',
  styleUrls: ['./edit-dog.component.scss'],
})
export class EditDogComponent {
  dog!: Dog;
  males$!: Observable<Dog[]>;
  females$!: Observable<Dog[]>;
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
      ({ dog }) => this.dog = dog);
    this.buildForm()
    this.males$ = this.dogService.getMaleDogs()
    this.females$ = this.dogService.getFemaleDogs()
    this.form.valueChanges.subscribe(values => {
      this.dog = { ...this.dog, ...values }
    })
  }

  buildForm() {
    this.form = this.fb.group({
      cname: [this.dog.cname],
      rname: [this.dog.rname],
      comments: [this.dog.comments],
      gender: [(this.dog.gender ? true : false)],
      dob: [this.dog.dob],
      sireId: [this.dog.sireId],
      damId: [this.dog.damId],
      profileImage: [this.dog.profileImageUrl]
    })
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
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        this.dog.profileImageUrl = e.target.result
      }
      reader.readAsDataURL(file)
    }

    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl;
    this.dog.profileImageUrl = this.croppedImage
    
    this.croppedImageBlob = event.blob;
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}

