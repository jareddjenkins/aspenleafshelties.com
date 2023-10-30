import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterdogsRoutingModule } from './enterdogs-routing.module';
import { EnterdogsComponent } from './enterdogs.component';
import { EditpagesComponent } from './editpages/editpages.component';
import { EditdogComponent } from './editdog/editdog.component';

import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

import { AsyncPipe } from '@angular/common';

import { NgbCollapse, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { RouterOutlet } from '@angular/router';

import { ImageCropperModule } from 'ngx-image-cropper';
import { DatePipe } from '@angular/common';

import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DogsModule } from '../dogs.module';

@NgModule({
  declarations: [
    EnterdogsComponent,
    EditpagesComponent,
    EditdogComponent,
    // EnterdogsnavComponent,
    // ListdogsComponent
  ],

  imports: [
    AsyncPipe,
    CommonModule,
    CdkDropList,
    CdkDrag,
    DatePipe,
    EnterdogsRoutingModule,
    DogsModule,
    ImageCropperModule,
    FormsModule,
    NgbCollapse,
    NgbDropdown,
    NgbDropdown,
    NgbDatepicker,
    RouterOutlet,
  ],
})
export class EnterdogsModule {}
