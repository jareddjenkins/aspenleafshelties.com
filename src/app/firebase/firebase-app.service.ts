import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAppService {
  private app = this.createApp();

  isEnabled(): boolean {
    return this.app !== null;
  }

  getApp(): FirebaseApp | null {
    return this.app;
  }

  private createApp(): FirebaseApp | null {
    const firebaseConfig = environment.firebase;
    if (!firebaseConfig?.apiKey || !firebaseConfig?.appId || !firebaseConfig?.projectId) {
      return null;
    }

    return getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
}
