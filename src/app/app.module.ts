import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { TopnavComponent } from './topnav/topnav.component';
import { GirlsComponent } from './girls/girls.component';
import { BoysComponent } from './boys/boys.component';
import { AvailableComponent } from './available/available.component';
import { LoginComponent } from './auth/login/login.component';
import { DogsComponent } from './dogs/dogs.component'
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { DogService } from './dog.service';
import { DogpagesService } from './dogpages.service';
import { DogDetailComponent } from './dog-detail/dog-detail.component';
import { EditdogComponent } from './enterdogs/editdog/editdog.component';
import { EnterdogsnavComponent } from './enterdogs/enterdogsnav/enterdogsnav.component';
import { ListdogsComponent } from './enterdogs/listdogs/listdogs.component';
import { EnterdogsComponent } from './enterdogs/enterdogs.component';
import { ResourcesComponent } from './resources/resources.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { nameContainsPipe } from './namesearch.pipes';
import { EditpagesComponent } from './enterdogs/editpages/editpages.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { AuthGuard } from './guards/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SignOutComponent } from './auth/sign-out/sign-out.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GirlsComponent,
    BoysComponent,
    AvailableComponent,
    MessagesComponent,
    DogsComponent,
    TopnavComponent,
    DogDetailComponent,
    EditdogComponent,
    EnterdogsnavComponent,
    ListdogsComponent,
    EnterdogsComponent,
    ResourcesComponent,
    nameContainsPipe,
    EditpagesComponent,
    ContactComponent,
    AboutComponent,
    FooterComponent,
    LoginComponent,
    SignOutComponent

  ],
  imports: [
    NgbModule,
    BrowserModule,
    RouterModule.forRoot([
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
    HttpClientModule,
    FormsModule,
    ImageCropperModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    SocialLoginModule
  ],
  bootstrap: [AppComponent],
  providers: [
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
            provider: new GoogleLoginProvider(
              '1005495952855-vvb7gdbsav5nl628kubn0jast1bn8prh.apps.googleusercontent.com'
            ),
          }
        ],
      } as SocialAuthServiceConfig,
    }
  ]
})
export class AppModule { }
