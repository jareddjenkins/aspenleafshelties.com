import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class UploaddogprofileimageService {
  private path = environment.apiEndpoint;

  constructor(private http: HttpClient) { }

  uploadDogImage(id:number,image: File){
    const fd = new FormData();
    fd.append('file',image, image.name)
    const url = `${this.path}/Dogs/${id}/Image`;
    this.http.post(url,fd)
    .subscribe(res => {
      console.log(res)
    })
  }
}
