import { Routes } from '@angular/router';

import { adminEditorGuard } from '../../auth/admin-editor.guard';
import { AdminComponent } from './admin.component';
import { EditdogComponent } from './editdog/editdog.component';
import { EditpagesComponent } from './editpages/editpages.component';
import { FirestoreAdminDataService } from '../../firebase/firestore-admin-data.service';
import { FirebaseAdminClientService } from '../../firebase/firebase-admin-client.service';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    providers: [FirebaseAdminClientService, FirestoreAdminDataService],
    component: AdminComponent,
    children: [
      { path: 'pages', component: EditpagesComponent, canActivate: [adminEditorGuard] },
      { path: 'editdog/:id', component: EditdogComponent, canActivate: [adminEditorGuard] },
    ],
  },
];
