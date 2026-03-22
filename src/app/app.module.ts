import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { TopnavComponent } from './topnav/topnav.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        ContactComponent,
        TopnavComponent,
        FooterComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        RouterLink,
        RouterLinkActive] })
export class AppModule {}
