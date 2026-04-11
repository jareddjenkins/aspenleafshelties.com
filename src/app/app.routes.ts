import { Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { DogDetailComponent } from './dogs/shared/dog-detail/dog-detail.component';
import { dogDetailResolver } from './dogs/public-dog.resolvers';
import { HomeComponent } from './home/home.component';
import { ResourcesComponent } from './resources/resources.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'Aspenleaf Shelties | Shetland Sheepdog Breeder in Georgia Near Atlanta',
      description:
        'Aspenleaf Shelties is a small Shetland Sheepdog breeder in Dewy Rose, Georgia serving families across Atlanta, Athens, Augusta, and beyond with AKC show and family Shelties.',
    },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./dogs/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    data: {
      title: 'Admin | Aspenleaf Shelties',
      description: 'Administrative tools for Aspenleaf Shelties.',
      robots: 'noindex, nofollow',
    },
  },
  {
    path: '',
    loadChildren: () => import('./dogs/dogs.routes').then((m) => m.DOGS_ROUTES),
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      title: 'Contact Aspenleaf Shelties | Sheltie Breeder in Georgia',
      description:
        'Contact Aspenleaf Shelties in Dewy Rose, Georgia to ask about Sheltie puppies, planned litters, and availability for families in Atlanta, Athens, Augusta, and nearby areas.',
    },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      title: 'About Aspenleaf Shelties | Georgia Sheltie Breeder',
      description:
        'Learn about Aspenleaf Shelties, a Dewy Rose, Georgia Shetland Sheepdog breeder focused on pedigree, health, temperament, AKC shows, and carefully matched homes.',
    },
  },
  {
    path: 'resources',
    component: ResourcesComponent,
    data: {
      title: 'Resources | Aspenleaf Shelties',
      description:
        'Resources recommended by Aspenleaf Shelties, including nutrition and care information for Shetland Sheepdogs and family companions.',
    },
  },
  {
    path: 'detail/:id',
    component: DogDetailComponent,
    resolve: {
      dog: dogDetailResolver,
    },
    data: {
      title: 'Sheltie Details | Aspenleaf Shelties',
      description:
        'View details for an Aspenleaf Shelties dog, including pedigree information, family lines, and profile notes.',
    },
  },
];
