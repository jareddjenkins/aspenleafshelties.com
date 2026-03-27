import { Injectable } from '@angular/core';
import { Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, connectStorageEmulator, getStorage } from 'firebase/storage';

import { environment } from '../../environments/environment';
import { FirebaseAppService } from './firebase-app.service';
import { resolveFirebaseEmulatorHost } from './firebase-web-config';

@Injectable()
export class FirebaseAdminClientService {
  private firestore = this.createFirestore();
  private storage = this.createStorage();

  constructor(private firebaseAppService: FirebaseAppService) {}

  getFirestore(): Firestore | null {
    return this.firestore;
  }

  getStorage(): FirebaseStorage | null {
    return this.storage;
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

  private createStorage(): FirebaseStorage | null {
    const app = this.firebaseAppService.getApp();
    if (!app) {
      return null;
    }

    const storage = getStorage(app);
    const emulatorConfig = environment.firebaseEmulators?.storage;
    if (emulatorConfig) {
      connectStorageEmulator(storage, resolveFirebaseEmulatorHost(emulatorConfig.host), emulatorConfig.port);
    }

    return storage;
  }
}
