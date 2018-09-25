import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { UploaddogprofileimageService } from '../../uploaddogprofileimage.service'

@Component({
  selector: 'app-uploadimage',
  templateUrl: './uploadimage.component.html',
  styleUrls: ['./uploadimage.component.css'],
})

export class UploadimageComponent implements OnInit {
  selectedFile = null;
  id = null;

  constructor(
    private uploadservice: UploaddogprofileimageService,
    private route: ActivatedRoute){}

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }
  onUpload() {
    this.uploadservice.uploadDogImage(this.id,this.selectedFile)
    
  }
    ngOnInit(): void {
      this.id = this.route.snapshot.paramMap.get('id');
    }

}
