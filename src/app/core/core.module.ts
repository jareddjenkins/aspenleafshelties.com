import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopNavComponent } from './desktop-nav/desktop-nav.component';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    DesktopNavComponent,
    MobileNavComponent,
    FooterComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
