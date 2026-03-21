export interface FirebaseWebConfig {
  apiKey: string;
  appId: string;
  authDomain: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket: string;
}

export interface FirebaseEmulatorServiceConfig {
  host: string;
  port: number;
}

export interface FirebaseEmulatorConfig {
  firestore?: FirebaseEmulatorServiceConfig;
  storage?: FirebaseEmulatorServiceConfig;
}
