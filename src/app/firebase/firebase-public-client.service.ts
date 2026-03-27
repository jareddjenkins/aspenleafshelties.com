import { Injectable } from '@angular/core';
import { Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore/lite';

import { environment } from '../../environments/environment';
import { FirebaseAppService } from './firebase-app.service';
import { resolveFirebaseEmulatorHost } from './firebase-web-config';

@Injectable({
  providedIn: 'root',
})
export class FirebasePublicClientService {
  private firestore = this.createFirestore();

  constructor(private firebaseAppService: FirebaseAppService) {}

  isEnabled(): boolean {
    return this.firebaseAppService.isEnabled();
  }

  getFirestore(): Firestore | null {
    return this.firestore;
  }

  private createFirestore(): Firestore | null {
    const app = this.firebaseAppService.getApp();
    if (!app) {
      return null;
    }

    const firestore = getFirestore(app);
    const emulatorConfig = environment.firebaseEmulators?.firestore;
    if (emulatorConfig) {
      connectFirestoreEmulator(firestore, resolveFirebaseEmulatorHost(emulatorConfig.host), emulatorConfig.port);
    }

    return firestore;
  }
}
