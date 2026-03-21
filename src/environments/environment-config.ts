import { FirebaseEmulatorConfig, FirebaseWebConfig } from '../app/firebase/firebase-web-config';

export interface EnvironmentConfig {
  production: boolean;
  firebase: FirebaseWebConfig;
  firebaseEmulators?: FirebaseEmulatorConfig;
}
