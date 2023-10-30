import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AvailableComponent } from './available/available.component'
import { BoysComponent } from './boys/boys.component'
import { GirlsComponent } from './girls/girls.component'
import { EnterdogsComponent } from './enterdogs/enterdogs.component'
import { NgFor, AsyncPipe } from '@angular/common';

import { DogsRoutingModule } from './dogs-routing.module';


@NgModule({
  declarations: [
    BoysComponent,
  ],
  imports: [
    CommonModule,
    DogsRoutingModule
  ],

})
export class DogsModule { }
