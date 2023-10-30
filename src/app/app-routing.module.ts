import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ResourcesComponent } from './resources/resources.component';
import { DogDetailComponent } from './dogs/shared/dog-detail/dog-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { SignOutComponent } from './auth/sign-out/sign-out.component';
import { EnterdogsComponent } from './dogs/enterdogs/enterdogs.component';
import { EditpagesComponent } from './dogs/enterdogs/editpages/editpages.component';
import { EditdogComponent } from './dogs/enterdogs/editdog/editdog.component';

const routes: Routes = [
  { path: '', redirectTo: "/home", pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dogs', loadChildren: () => import('./dogs/dogs.module').then(m => m.DogsModule) },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'detail/:id', component: DogDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signout', component: SignOutComponent },
  {
    path: 'enterdogs',
    redirectTo: 'dogs/enterdogs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
