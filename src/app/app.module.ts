import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { TopnavComponent } from './topnav/topnav.component';
import { FooterComponent } from './footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    TopnavComponent,
    FooterComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSidenavModule,
    RouterLink,
    RouterLinkActive,
  ],
  providers: [provideClientHydration(withEventReplay()), provideAnimationsAsync()],
})
export class AppModule {}
