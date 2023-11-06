import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterdogsRoutingModule } from './enterdogs-routing.module';
import { EditDogComponent } from './edit-dog/edit-dog.component';

@NgModule({
  declarations: [EditDogComponent],
  imports: [CommonModule, EnterdogsRoutingModule],
})
export class EnterdogsModule {}
