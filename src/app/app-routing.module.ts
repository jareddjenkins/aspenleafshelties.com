import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'dogs',
    loadChildren: () => import('./dogs/dogs.module').then((m) => m.DogsModule),
  },
  // {
  //   path: 'static',
  //   loadChildren: () => import('./static/static.module').then((m) => m.StaticModule),
  // },
  // {
  //   path: 'enterdogs',
  //   redirectTo: 'dogs/enterdogs',
  //   pathMatch: 'full',
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
