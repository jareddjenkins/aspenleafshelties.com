import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterdogsRoutingModule } from './enterdogs-routing.module';
import { EditDogComponent } from './edit-dog/edit-dog.component';
import { ListAllComponent } from './list-all/list-all.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableModule } from '@angular/material/table'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditDogComponent, ListAllComponent],
  imports: [
    CommonModule,
    EnterdogsRoutingModule,
    SharedModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
})
export class EnterdogsModule {


}
