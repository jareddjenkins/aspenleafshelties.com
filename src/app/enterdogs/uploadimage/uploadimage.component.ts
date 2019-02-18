import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { UploaddogprofileimageService } from '../../uploaddogprofileimage.service'
import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
  selector: 'app-uploadimage',
  templateUrl: './uploadimage.component.html',
  styleUrls: ['./uploadimage.component.css'],
})

export class UploadimageComponent implements OnInit {

  id = null;

  constructor(
    private uploadservice: UploaddogprofileimageService,
    private route: ActivatedRoute) { }


  onUpload() {
    var x = this.dataURLtoBlob(this.croppedImage)
    this.uploadservice.uploadDogImage(this.id, x)

  }
  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  //imagecropper
  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
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
