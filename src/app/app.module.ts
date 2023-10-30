import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgbCollapse, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { TopnavComponent } from './topnav/topnav.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    TopnavComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterLink,
    RouterLinkActive,
    NgbCollapse,
    NgbDropdown,
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
