import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { EditpagesComponent } from './editpages/editpages.component';
import { EditdogComponent } from './editdog/editdog.component';

import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AsyncPipe } from '@angular/common';

import { NgbCollapse, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { RouterOutlet } from '@angular/router';

import { ImageCropperComponent } from 'ngx-image-cropper';
import { DatePipe } from '@angular/common';

import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DogsModule } from '../dogs.module';
import { ListdogsComponent } from './listdogs/listdogs.component';
import { MaterialComponentsModule } from 'src/app/shared/material-components/material-components.module';
import { FirestoreAdminDataService } from '../../firebase/firestore-admin-data.service';
import { FirebaseAdminClientService } from '../../firebase/firebase-admin-client.service';

@NgModule({
  declarations: [
    AdminComponent,
    EditpagesComponent,
    EditdogComponent,
    ListdogsComponent
  ],

  imports: [
    AsyncPipe,
    CommonModule,
    CdkDropList,
    CdkDrag,
    DatePipe,
    AdminRoutingModule,
    MaterialComponentsModule,
    DogsModule,
    ImageCropperComponent,
    FormsModule,
    ReactiveFormsModule,
    NgbCollapse,
    NgbDropdown,
    NgbDropdown,
    NgbDatepicker,
    RouterOutlet,
  ],
  providers: [FirebaseAdminClientService, FirestoreAdminDataService],
})
export class AdminModule {}
