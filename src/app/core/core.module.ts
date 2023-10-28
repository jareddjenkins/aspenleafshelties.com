import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { DesktopNavComponent } from './desktop-nav/desktop-nav.component';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AppRoutingModule } from '../app-routing.module';
import {MatListModule} from '@angular/material/list';

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
    MatToolbarModule,
    MatIconModule, RouterLink, MatButtonModule,MatSidenavModule,
    AppRoutingModule,
    MatListModule
  ],
  exports: [
    DesktopNavComponent,
    MobileNavComponent,
    FooterComponent
  ]
})
export class CoreModule { }
