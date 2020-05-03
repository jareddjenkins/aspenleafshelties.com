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
    AboutComponent

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
      {
        path: 'enterdogs',
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
    MatInputModule

  ],
  bootstrap: [AppComponent],
  providers: [DogService, DogpagesService, MessageService]
})
export class AppModule { }
