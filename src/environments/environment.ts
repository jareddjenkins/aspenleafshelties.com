import { FirebaseEmulatorConfig, FirebaseWebConfig } from '../app/firebase/firebase-web-config';
import { EnvironmentConfig } from './environment-config';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

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
