import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoysComponent } from './boys/boys.component';
import { GirlsComponent } from './girls/girls.component';
import { AvailableComponent } from './available/available.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: "BoysComponent",
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
    component: AvailableComponent

  },
  {
    path: 'puppies',
    redirectTo: "available",
    pathMatch: "full"
  },
  {path: 'enterdogs',loadChildren: () => import('./enterdogs/enterdogs.component').then(m => m.EnterdogsComponent) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DogsRoutingModule { }
