import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }      from './home/home.component';
import { GirlsComponent } from './girls/girls.component';
import { BoysComponent } from './boys/boys.component';
import { AvailableComponent } from './available/available.component';
import { DogDetailComponent } from './dog-detail/dog-detail.component'

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'home', component: HomeComponent },
  { path: 'boys', component: BoysComponent},
  { path: 'girls', component: GirlsComponent},
  { path: 'available', component: AvailableComponent},
  { path: 'detail/:id', component: DogDetailComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}