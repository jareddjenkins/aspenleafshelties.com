import { NgModule, Provider } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { DogsInterceptorService } from './shared/dogs-interceptor.service';
import { environment } from 'src/environments/environment';

const interceptorProvider: Provider =
{
  provide: HTTP_INTERCEPTORS,
  useClass: DogsInterceptorService,
  multi: true
}

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    AppRoutingModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CoreModule,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
    SharedModule
  ],
  bootstrap: [AppComponent],
  providers: [
    environment.enableInterceptor ? interceptorProvider : []
  ]
})
export class AppModule { }
