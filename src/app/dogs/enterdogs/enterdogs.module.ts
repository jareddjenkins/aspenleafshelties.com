import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterdogsRoutingModule } from './enterdogs-routing.module';
import { EnterdogsComponent } from './enterdogs.component';
import { EditpagesComponent } from './editpages/editpages.component';
import { EditdogComponent } from './editdog/editdog.component';
import { EnterdogsnavComponent } from './enterdogsnav/enterdogsnav.component';
import { ListdogsComponent } from './listdogs/listdogs.component';

import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import {  FormBuilder, UntypedFormGroup, FormArray, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatLegacyAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { NgbCollapse, NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterOutlet } from '@angular/router';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { ImageCropperModule } from 'ngx-image-cropper';
import { Location, NgIf, DatePipe } from '@angular/common';
import { NgbDateAdapter, NgbDateStruct, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

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
    ImageCropperModule,
    FormsModule,
    NgbCollapse,
    NgbModule,
    NgbCollapse,
    NgbDropdown,
    NgbDropdown,
    NgbDatepicker,
    NgIf,
    NgFor,
    MatAutocompleteModule,
    MatIconModule,
    MatLegacyFormFieldModule,
    MatLegacyOptionModule,
    MatLegacyInputModule,
    MatLegacyAutocompleteModule,
    ReactiveFormsModule,
    RouterOutlet
  ]
})
export class EnterdogsModule { }
