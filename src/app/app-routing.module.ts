import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'
import { BoysComponent } from './boys/boys.component'
import { GirlsComponent } from './girls/girls.component'
import { AvailableComponent } from './available/available.component'
import { ContactComponent } from './contact/contact.component'
import { AboutComponent } from './about/about.component'
import { ResourcesComponent } from './resources/resources.component'
import { DogDetailComponent } from './dog-detail/dog-detail.component'
import { LoginComponent } from './auth/login/login.component'
import { SignOutComponent } from './auth/sign-out/sign-out.component'
import { EnterdogsComponent } from './enterdogs/enterdogs.component'
import { EditpagesComponent } from './enterdogs/editpages/editpages.component'
import { EditdogComponent } from './enterdogs/editdog/editdog.component'


const routes: Routes = [
    { path: '', redirectTo: "/home", pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'boys', component: BoysComponent },
    { path: 'girls', component: GirlsComponent },
    { path: 'puppies', component: AvailableComponent },
    { path: 'available', component: AvailableComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'about', component: AboutComponent },
    { path: 'resources', component: ResourcesComponent },
    { path: 'detail/:id', component: DogDetailComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signout', component: SignOutComponent },
    {
      path: 'enterdogs',
      // canActivate: [AuthGuard],
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
