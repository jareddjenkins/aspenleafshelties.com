import { CanActivateFn, CanMatchFn, Router, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { AvailableComponent } from './available/available.component';
import { environment } from '../../environments/environment';
import { FaqComponent } from './faq/faq.component';
import { GettingASheltieComponent } from './getting-a-sheltie/getting-a-sheltie.component';
import { OurSheltiesComponent } from './our-shelties/our-shelties.component';
import {
  availableAdultsResolver,
  boysPageResolver,
  companionPuppiesResolver,
  girlsPageResolver,
  showPuppiesResolver,
} from './public-dog.resolvers';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';

const questionnaireEnabledRedirect = () =>
  environment.questionnaireEnabled || inject(Router).parseUrl('/contact');

const questionnaireEnabledCanMatch: CanMatchFn = () => questionnaireEnabledRedirect();
const questionnaireEnabledCanActivate: CanActivateFn = () => questionnaireEnabledRedirect();

export const DOGS_ROUTES: Routes = [
  {
    path: 'our-shelties',
    component: OurSheltiesComponent,
    resolve: {
      boys: boysPageResolver,
      girls: girlsPageResolver,
    },
    data: {
      title: 'Our Shelties | Aspenleaf Shelties Georgia Sheltie Breeder',
      description:
        'Meet the boys and girls of Aspenleaf Shelties, a Dewy Rose, Georgia Shetland Sheepdog breeder focused on quality, temperament, sound structure, and family-raised Shelties.',
    },
  },
  {
    path: 'available',
    component: AvailableComponent,
    resolve: {
      showPuppies: showPuppiesResolver,
      companionPuppies: companionPuppiesResolver,
      adults: availableAdultsResolver,
    },
    data: {
      title: 'Available Shelties in Georgia Near Atlanta | Aspenleaf Shelties',
      description:
        'See available show puppies, companion puppies, and adult Shelties at Aspenleaf Shelties in Dewy Rose, Georgia for families in Atlanta, Athens, Augusta, and beyond.',
    },
  },
  {
    path: 'getting-a-sheltie',
    component: GettingASheltieComponent,
    data: {
      title: 'Puppy Process | Aspenleaf Shelties',
      description:
        'Learn how Aspenleaf Shelties handles timing, placement, and the first steps for families interested in bringing home a Sheltie in Georgia.',
    },
  },
  {
    path: 'faq',
    component: FaqComponent,
    data: {
      title: 'Sheltie FAQ | Aspenleaf Shelties',
      description:
        'Read frequently asked questions about pricing, deposits, pickup timing, health testing, puppy selection, and visits at Aspenleaf Shelties in Dewy Rose, Georgia.',
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
