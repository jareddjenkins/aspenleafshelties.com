import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, connectStorageEmulator, getStorage } from 'firebase/storage';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseClientService {
  private app = this.createApp();
  private firestore = this.createFirestore();
  private storage = this.createStorage();

  isEnabled(): boolean {
    return this.app !== null;
  }

  getFirestore(): Firestore | null {
    return this.firestore;
  }

  getStorage(): FirebaseStorage | null {
    return this.storage;
  }

  private createApp(): FirebaseApp | null {
    const firebaseConfig = environment.firebase;
    if (!firebaseConfig?.apiKey || !firebaseConfig?.appId || !firebaseConfig?.projectId) {
      return null;
    }

    return getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  private createFirestore(): Firestore | null {
    if (!this.app) {
      return null;
    }

    const firestore = getFirestore(this.app);
    const emulatorConfig = environment.firebaseEmulators?.firestore;
    if (emulatorConfig) {
      connectFirestoreEmulator(firestore, emulatorConfig.host, emulatorConfig.port);
    }

    return firestore;
  }

  private createStorage(): FirebaseStorage | null {
    if (!this.app) {
      return null;
    }

    const storage = getStorage(this.app);
    const emulatorConfig = environment.firebaseEmulators?.storage;
    if (emulatorConfig) {
      connectStorageEmulator(storage, emulatorConfig.host, emulatorConfig.port);
    }

    return storage;
  }
}
