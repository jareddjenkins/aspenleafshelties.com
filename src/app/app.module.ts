import { NgModule } from '@angular/core';

import { enableProdMode, importProvidersFrom } from '@angular/core';


import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { EditdogComponent } from './dogs/enterdogs/editdog/editdog.component';
import { EditpagesComponent } from './dogs/enterdogs/editpages/editpages.component';
import { EnterdogsComponent } from './dogs/enterdogs/enterdogs.component';
import { SignOutComponent } from './auth/sign-out/sign-out.component';
import { LoginComponent } from './auth/login/login.component';
import { DogDetailComponent } from './dogs/shared/dog-detail/dog-detail.component';
import { ResourcesComponent } from './resources/resources.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AvailableComponent } from './dogs/available/available.component';
import { GirlsComponent } from './dogs/girls/girls.component';
import { HomeComponent } from './home/home.component';
import { RouterLink, RouterLinkActive, provideRouter } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { NgbCollapse, NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { AuthGuard } from './guards/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { MessageService } from './message.service';
import { DogpagesService } from './dogpages.service';
import { DogService } from './dog.service';
import { AppRoutingModule } from './app-routing.module';
import { TopnavComponent } from './topnav/topnav.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ContactComponent,
        TopnavComponent,
         FooterComponent
        
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        RouterLink, RouterLinkActive, NgbCollapse, NgbDropdown
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }


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

        ]),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideAnimations()
    ]
})
    .catch(err => console.log(err));
