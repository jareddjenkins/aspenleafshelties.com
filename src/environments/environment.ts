import { FirebaseEmulatorConfig, FirebaseWebConfig } from '../app/firebase/firebase-web-config';
import { EnvironmentConfig } from './environment-config';

// Local development uses a demo Firebase project wired to the local emulators.

export const environment: EnvironmentConfig = {
  production: false,
  firebase: {
    apiKey: 'demo-api-key',
    authDomain: 'demo-aspenleafshelties.firebaseapp.com',
    projectId: 'demo-aspenleafshelties',
    storageBucket: 'demo-aspenleafshelties.appspot.com',
    messagingSenderId: 'demo-messaging-sender',
    appId: '1:demo:web:local',
  } satisfies FirebaseWebConfig,
  firebaseEmulators: {
    firestore: {
      host: '127.0.0.1',
      port: 8080,
    },
    storage: {
      host: '127.0.0.1',
      port: 9199,
    },
  } satisfies FirebaseEmulatorConfig,
};
