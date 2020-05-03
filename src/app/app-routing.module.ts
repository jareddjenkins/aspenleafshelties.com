import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { GirlsComponent } from './girls/girls.component';
import { BoysComponent } from './boys/boys.component';
import { AvailableComponent } from './available/available.component';
import { DogDetailComponent } from './dog-detail/dog-detail.component';
import { ListdogsComponent } from './enterdogs/listdogs/listdogs.component'
import { EditdogComponent } from './enterdogs/editdog/editdog.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { EnterdogsComponent } from './enterdogs/enterdogs.component'
import { ResourcesComponent } from './resources/resources.component'
import { EditpagesComponent } from './enterdogs/editpages/editpages.component';

const routes: Routes = [
  { path: '', redirectTo: "/home", pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'boys', component: BoysComponent },
  { path: 'girls', component: GirlsComponent },
  { path: 'puppies', component: AvailableComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'detail/:id', component: DogDetailComponent },
  {
    path: 'enterdogs',
    children: [
      { path: '', component: EnterdogsComponent },
      { path: 'pages', component: EditpagesComponent },
      { path: 'editdog/:id', component: EditdogComponent }
    ]
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }