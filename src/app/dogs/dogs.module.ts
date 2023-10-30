import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoysComponent } from './boys/boys.component';
import { GirlsComponent } from './girls/girls.component';
import { AvailableComponent } from './available/available.component';

import { DogsRoutingModule } from './dogs-routing.module';
import { DogpagesService } from 'src/app/dogpages.service';
import { DogsComponent } from './dogs.component';

@NgModule({
  declarations: [
    AvailableComponent,
    BoysComponent,
    GirlsComponent,
    DogsComponent

  ],
  imports: [
    CommonModule,
    DogsRoutingModule,
  ],

})
export class DogsModule { }
