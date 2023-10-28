import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticRoutingModule } from './static-routing.module';
import { AboutComponent } from './about/about.component';
import { ResourcesComponent } from './resources/resources.component';
import { ContactComponent } from './contact/contact.component';


@NgModule({
  declarations: [
    AboutComponent,
    ResourcesComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    StaticRoutingModule
  ]
})
export class StaticModule { }
