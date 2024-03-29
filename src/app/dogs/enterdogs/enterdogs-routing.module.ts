import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnterdogsComponent } from './enterdogs.component';
import { EditpagesComponent } from './editpages/editpages.component';
import { EditdogComponent } from './editdog/editdog.component';

const routes: Routes = [
  { path: '', component: EnterdogsComponent },
  { path: 'pages', component: EditpagesComponent },
  { path: 'editdog/:id', component: EditdogComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterdogsRoutingModule {}
