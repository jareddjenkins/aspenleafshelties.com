import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoysComponent } from './boys/boys.component';
import { GirlsComponent } from './girls/girls.component';
import { AvailableComponent } from './available/available.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'boys',
    pathMatch: 'full',
  },
  {
    path: 'boys',
    component: BoysComponent,
    data: {
      title: 'Boys | Aspenleaf Shelties',
      description:
        'Meet the boys of Aspenleaf Shelties, a Georgia Shetland Sheepdog breeder focused on AKC quality, temperament, and sound structure.',
    },
  },
  {
    path: 'girls',
    component: GirlsComponent,
    data: {
      title: 'Girls | Aspenleaf Shelties',
      description:
        'Meet the girls of Aspenleaf Shelties, thoughtfully bred Shetland Sheepdogs in Georgia with attention to pedigree, health, and family temperament.',
    },
  },
  {
    path: 'available',
    component: AvailableComponent,
    data: {
      title: 'Available Sheltie Puppies in Georgia | Aspenleaf Shelties',
      description:
        'See available Sheltie puppies and companion opportunities at Aspenleaf Shelties in Dewy Rose, Georgia, and learn about planned litters and placement.',
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
