import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { DesktopNavComponent } from './desktop-nav/desktop-nav.component';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';
import { SharedModule } from '../shared/shared.module';

import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
    MobileNavComponent,
    DesktopNavComponent,
    FooterComponent,
    DesktopNavComponent,
    MobileNavComponent,

  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule
  ],
  exports: [
    DesktopNavComponent,
    MobileNavComponent,
    FooterComponent
  ]
})
export class CoreModule { }
