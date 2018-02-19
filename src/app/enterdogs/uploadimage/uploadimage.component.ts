import { Component, OnInit,Input } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
import { Dog } from '../../dog'

@Component({
  selector: 'app-uploadimage',
  templateUrl: './uploadimage.component.html',
  styleUrls: ['./uploadimage.component.css'],
})
export class UploadimageComponent implements OnInit {

  @Input ()
    dog = Dog;

  ngOnInit(): void {
  }

  data: any;
  cropperSettings: CropperSettings;

  constructor() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;

    this.data = {};
  }
}