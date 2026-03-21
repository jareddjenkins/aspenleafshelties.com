import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Dog } from '../../model/dog';
import { DogService } from '../../../dog.service';
import { FirestoreAdminDataService } from '../../../firebase/firestore-admin-data.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-listdogs',
    templateUrl: './listdogs.component.html',
    styleUrls: ['./listdogs.component.css'],
    standalone: false
})
export class ListdogsComponent implements OnInit {
  dogs: Observable<Dog[]>;
  query = '';

  constructor(
    private dogService: DogService,
    private firestoreAdminDataService: FirestoreAdminDataService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getDogs();
  }
  createnewdog() {
    this.firestoreAdminDataService.addDog().subscribe((dog) => {
      this.getDogs();
      this.router.navigate([`/dogs/enterdogs/editdog/${dog.id}`]);
    });
  }

  getDogs() {
    this.dogs = this.dogService.getDogs();
  }

  goToPages(): void {
    this.router.navigate(['/dogs/enterdogs/pages']);
  }

  goBack(): void {
    this.location.back();
  }
}
