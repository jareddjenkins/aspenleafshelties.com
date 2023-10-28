import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ResourcesComponent } from './resources/resources.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: "about",
    pathMatch: 'full'
  },
  {
    path: "about",
    component: AboutComponent
  },
  {
    path: "contact",
    component: ContactComponent
  },
  {
    path: "resources",
    component: ResourcesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule { }
