import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BoysComponent } from './boys/boys.component';
import { GirlsComponent } from './girls/girls.component';
import { AvailableComponent } from './available/available.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';

import { DogsRoutingModule } from './dogs-routing.module';
import { DogsComponent } from './dogs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [
    AvailableComponent,
    QuestionnaireComponent,
    BoysComponent,
    GirlsComponent,
    DogsComponent,
  ],
  imports: [CommonModule, DogsRoutingModule, ReactiveFormsModule, RouterLink, DatePipe],
  exports: [DogsComponent],
})
export class DogsModule {}
