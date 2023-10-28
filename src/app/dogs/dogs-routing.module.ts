import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoysComponent } from './boys/boys.component';
import { GirlsComponent } from './girls/girls.component';
import { PuppiesComponent } from './puppies/puppies.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: "puppies",
    pathMatch: 'full'
  },
  {
    path: 'boys',
    component: BoysComponent,
  },
  {
    path: 'girls',
    component: GirlsComponent,
  },
  {
    path: "available",
    redirectTo: "puppies",
    pathMatch: "full"
  },
  {
    path: 'puppies',
    component: PuppiesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DogsRoutingModule { }
