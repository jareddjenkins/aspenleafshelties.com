import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { GirlsComponent } from './girls/girls.component';
import { BoysComponent } from './boys/boys.component';
import { AvailableComponent } from './available/available.component';
import { DogDetailComponent } from './dog-detail/dog-detail.component';
import { ListdogsComponent } from './enterdogs/listdogs/listdogs.component'
import { EditdogComponent } from './enterdogs/editdog/editdog.component';
import { EnterdogsComponent } from './enterdogs/enterdogs.component'
import { ResourcesComponent } from './resources/resources.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'boys', component: BoysComponent },
  { path: 'girls', component: GirlsComponent },
  { path: 'available', component: AvailableComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'detail/:id', component: DogDetailComponent },
  {
    path: 'enterdogs', component: EnterdogsComponent,
    children: [
      { path: '', component: ListdogsComponent },
      { path: 'editdog/:id', component: EditdogComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }