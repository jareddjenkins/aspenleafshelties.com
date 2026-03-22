import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ResourcesComponent } from './resources/resources.component';
import { DogDetailComponent } from './dogs/shared/dog-detail/dog-detail.component';
import { dogDetailResolver } from './dogs/public-dog.resolvers';

const routes: Routes = [
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
      import('./dogs/admin/admin.module').then((m) => m.AdminModule),
    data: {
      title: 'Admin | Aspenleaf Shelties',
      description: 'Administrative tools for Aspenleaf Shelties.',
      robots: 'noindex, nofollow',
    },
  },
  {
    path: 'dogs',
    loadChildren: () => import('./dogs/dogs.module').then((m) => m.DogsModule),
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

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
