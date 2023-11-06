import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticRoutingModule } from './static-routing.module';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ResourcesComponent } from './resources/resources.component';

@NgModule({
  declarations: [AboutComponent, ContactComponent, ResourcesComponent],
  imports: [CommonModule, StaticRoutingModule],
})
export class StaticModule {}
