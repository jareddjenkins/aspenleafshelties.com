import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoysComponent } from './boys/boys.component'

import { DogsRoutingModule } from './dogs-routing.module';
import { DogpagesService } from 'src/app/dogpages.service';

@NgModule({
  declarations: [
    BoysComponent,

  ],
  imports: [
    CommonModule,
    DogsRoutingModule,
  ],

})
export class DogsModule { }
