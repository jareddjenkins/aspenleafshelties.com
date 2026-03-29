import { NgModule } from '@angular/core';
import { inject } from '@angular/core';
import { Router, RouterModule, Routes, CanActivateFn, CanMatchFn } from '@angular/router';
import { BoysComponent } from './boys/boys.component';
import { GirlsComponent } from './girls/girls.component';
import { AvailableComponent } from './available/available.component';
import { GettingASheltieComponent } from './getting-a-sheltie/getting-a-sheltie.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import {
  availableAdultsResolver,
  availablePuppiesResolver,
  boysPageResolver,
  girlsPageResolver,
} from './public-dog.resolvers';
import { environment } from '../../environments/environment';

const questionnaireEnabledRedirect = () =>
  environment.questionnaireEnabled || inject(Router).parseUrl('/contact');

const questionnaireEnabledCanMatch: CanMatchFn = () => questionnaireEnabledRedirect();
const questionnaireEnabledCanActivate: CanActivateFn = () => questionnaireEnabledRedirect();

const routes: Routes = [
  {
    path: '',
    redirectTo: 'boys',
    pathMatch: 'full',
  },
  {
    path: 'boys',
    component: BoysComponent,
    resolve: {
      dogs: boysPageResolver,
    },
    data: {
      title: 'Boys | Aspenleaf Shelties Georgia Sheltie Breeder',
      description:
        'Meet the boys of Aspenleaf Shelties, a Dewy Rose, Georgia Shetland Sheepdog breeder focused on AKC quality, temperament, sound structure, and families across Georgia.',
    },
  },
  {
    path: 'girls',
    component: GirlsComponent,
    resolve: {
      dogs: girlsPageResolver,
    },
    data: {
      title: 'Girls | Aspenleaf Shelties Georgia Sheltie Breeder',
      description:
        'Meet the girls of Aspenleaf Shelties, thoughtfully bred Shetland Sheepdogs in Dewy Rose, Georgia with attention to pedigree, health, and family temperament.',
    },
  },
  {
    path: 'available',
    component: AvailableComponent,
    resolve: {
      puppies: availablePuppiesResolver,
      adults: availableAdultsResolver,
    },
    data: {
      title: 'Available Sheltie Puppies in Georgia Near Atlanta | Aspenleaf Shelties',
      description:
        'See available Sheltie puppies and companion opportunities at Aspenleaf Shelties in Dewy Rose, Georgia for families in Atlanta, Athens, Augusta, and beyond.',
    },
  },
  {
    path: 'getting-a-sheltie',
    component: GettingASheltieComponent,
    data: {
      title: 'Getting a Sheltie | Aspenleaf Shelties',
      description:
        'Learn what to expect when getting a Sheltie from Aspenleaf Shelties, including breed fit, puppy placement, and how to begin the inquiry process in Georgia.',
    },
  },
  {
    path: 'questionnaire',
    component: QuestionnaireComponent,
    canMatch: [questionnaireEnabledCanMatch],
    canActivate: [questionnaireEnabledCanActivate],
    data: {
      title: 'Sheltie Questionnaire | Aspenleaf Shelties',
      description:
        'Complete the Aspenleaf Shelties questionnaire to share your home, goals, and expectations before reserving a Sheltie puppy or companion in Georgia.',
    },
  },
  {
    path: 'puppies',
    redirectTo: 'available',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DogsRoutingModule {}
