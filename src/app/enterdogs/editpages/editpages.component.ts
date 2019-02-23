import { Component, OnInit } from '@angular/core';
import { DogpagesService } from '../../dogpages.service'
import { Observable ,  of } from 'rxjs';

@Component({
  selector: 'app-editpages',
  templateUrl: './editpages.component.html',
  styleUrls: ['./editpages.component.css']
})
export class EditpagesComponent implements OnInit {
  pages: Observable<string[]>;

  constructor(private dogpagesService: DogpagesService) { }

  ngOnInit() {
    this.pages = this.dogpagesService.getPages();
  }
}
