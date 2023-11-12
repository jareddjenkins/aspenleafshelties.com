import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAllComponent } from './list-all/list-all.component';
// import { EnterdogsComponent } from './enterdogs.component';
import { EditDogComponent } from './edit-dog/edit-dog.component';
import { dogResolver } from 'src/app/shared/dogs.service';

const routes: Routes = [
  { path: '', component: ListAllComponent },
  {
    path: 'edit/:id',
    component: EditDogComponent,
    resolve: { dog: dogResolver }
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterdogsRoutingModule {

}
