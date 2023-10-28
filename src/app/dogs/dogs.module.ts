import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DogsRoutingModule } from './dogs-routing.module';
import { DetailComponent } from './shared/detail/detail.component';
import { BoysComponent } from './boys/boys.component';
import { GirlsComponent } from './girls/girls.component';
import { PuppiesComponent } from './puppies/puppies.component';


@NgModule({
  declarations: [
  
    DetailComponent,
       BoysComponent,
       GirlsComponent,
       PuppiesComponent
  ],
  imports: [
    CommonModule,
    DogsRoutingModule
  ]
})
export class DogsModule { }
