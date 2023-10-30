import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvailableComponent } from './available/available.component'
import { BoysComponent } from './boys/boys.component'
import { GirlsComponent } from './girls/girls.component'

import { DogsRoutingModule } from './dogs-routing.module';
import { DogpagesService } from 'src/app/dogpages.service';

@NgModule({
  declarations: [
    AvailableComponent,
    BoysComponent,
    GirlsComponent

  ],
  imports: [
    CommonModule,
    DogsRoutingModule,
  ],

})
export class DogsModule { }
