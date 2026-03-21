import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseClientService {
  private app = this.createApp();

  isEnabled(): boolean {
    return this.app !== null;
  }

  getFirestore(): Firestore | null {
    return this.app ? getFirestore(this.app) : null;
  }

  getStorage(): FirebaseStorage | null {
    return this.app ? getStorage(this.app) : null;
  }

  private createApp(): FirebaseApp | null {
    const firebaseConfig = environment.firebase;
    if (!firebaseConfig?.apiKey || !firebaseConfig?.appId || !firebaseConfig?.projectId) {
      return null;
    }

    return getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
}
