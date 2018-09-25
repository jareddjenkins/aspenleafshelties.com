import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomeComponent }      from './home/home.component';
import { TopnavComponent } from './topnav/topnav.component';
import { GirlsComponent } from './girls/girls.component';
import { BoysComponent } from './boys/boys.component';
import { AvailableComponent } from './available/available.component';
import { DogsComponent } from './dogs/dogs.component'
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { DogService } from './dog.service';
import { DogDetailComponent } from './dog-detail/dog-detail.component';
import { EditdogComponent } from './enterdogs/editdog/editdog.component';
import { EnterdogsnavComponent } from './enterdogs/enterdogsnav/enterdogsnav.component';
import { ListdogsComponent } from './enterdogs/listdogs/listdogs.component';
import { EnterdogsComponent } from './enterdogs/enterdogs.component';
import { UploadimageComponent } from './enterdogs/uploadimage/uploadimage.component';
import { ResourcesComponent } from './resources/resources.component';
import { UploaddogprofileimageService } from './uploaddogprofileimage.service';

@NgModule({
  declarations:[
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
    UploadimageComponent,
    ResourcesComponent
    
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [AppComponent],
  providers: [DogService, MessageService, UploaddogprofileimageService]
})
export class AppModule { }
