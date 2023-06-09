/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from '@angular/core';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { EditdogComponent } from './app/enterdogs/editdog/editdog.component';
import { EditpagesComponent } from './app/enterdogs/editpages/editpages.component';
import { EnterdogsComponent } from './app/enterdogs/enterdogs.component';
import { SignOutComponent } from './app/auth/sign-out/sign-out.component';
import { LoginComponent } from './app/auth/login/login.component';
import { DogDetailComponent } from './app/dog-detail/dog-detail.component';
import { ResourcesComponent } from './app/resources/resources.component';
import { AboutComponent } from './app/about/about.component';
import { ContactComponent } from './app/contact/contact.component';
import { AvailableComponent } from './app/available/available.component';
import { GirlsComponent } from './app/girls/girls.component';
import { BoysComponent } from './app/boys/boys.component';
import { HomeComponent } from './app/home/home.component';
import { provideRouter } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { AuthGuard } from './app/guards/auth-guard.service';
import { AuthService } from './app/auth/auth.service';
import { MessageService } from './app/message.service';
import { DogpagesService } from './app/dogpages.service';
import { DogService } from './app/dog.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
    importProvidersFrom(NgbModule, BrowserModule, FormsModule, ImageCropperModule, MatButtonModule, MatCheckboxModule, MatIconModule, DragDropModule, ReactiveFormsModule, FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, SocialLoginModule),
    DogService,
    DogpagesService,
    MessageService,
    AuthService,
    AuthGuard,
    {
        provide: 'SocialAuthServiceConfig',
        useValue: {
            autoLogin: true,
            providers: [
                {
                    id: GoogleLoginProvider.PROVIDER_ID,
                    provider: new GoogleLoginProvider('1005495952855-vvb7gdbsav5nl628kubn0jast1bn8prh.apps.googleusercontent.com'),
                }
            ],
        } as SocialAuthServiceConfig,
    },
    provideRouter([
        { path: '', redirectTo: "/home", pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'boys', component: BoysComponent },
        { path: 'girls', component: GirlsComponent },
        { path: 'puppies', component: AvailableComponent },
        { path: 'available', component: AvailableComponent },
        { path: 'contact', component: ContactComponent },
        { path: 'about', component: AboutComponent },
        { path: 'resources', component: ResourcesComponent },
        { path: 'detail/:id', component: DogDetailComponent },
        { path: 'login', component: LoginComponent },
        { path: 'signout', component: SignOutComponent },
        {
            path: 'enterdogs',
            // canActivate: [AuthGuard],
            children: [
                { path: '', component: EnterdogsComponent },
                { path: 'pages', component: EditpagesComponent },
                { path: 'editdog/:id', component: EditdogComponent }
            ]
        },
        { path: '**', component: HomeComponent },
    ]),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideAnimations()
]
})
  .catch(err => console.log(err));
