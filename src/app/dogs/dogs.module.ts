import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BoysComponent } from './boys/boys.component';
import { GirlsComponent } from './girls/girls.component';
import { AvailableComponent } from './available/available.component';
import { GettingASheltieComponent } from './getting-a-sheltie/getting-a-sheltie.component';
import { FaqComponent } from './faq/faq.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';

import { DogsRoutingModule } from './dogs-routing.module';
import { DogsComponent } from './dogs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AvailableComponent,
    GettingASheltieComponent,
    FaqComponent,
    QuestionnaireComponent,
    BoysComponent,
    GirlsComponent,
    DogsComponent,
  ],
  imports: [CommonModule, DogsRoutingModule, ReactiveFormsModule, RouterLink, DatePipe, MatTabsModule],
  exports: [DogsComponent],
})
export class DogsModule {}
