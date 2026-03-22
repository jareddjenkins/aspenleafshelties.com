import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminEditorGuard } from '../../auth/admin-editor.guard';
import { AdminComponent } from './admin.component';
import { EditpagesComponent } from './editpages/editpages.component';
import { EditdogComponent } from './editdog/editdog.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'pages', component: EditpagesComponent, canActivate: [adminEditorGuard] },
      { path: 'editdog/:id', component: EditdogComponent, canActivate: [adminEditorGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
