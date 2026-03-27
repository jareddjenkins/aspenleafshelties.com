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
  auth?: FirebaseEmulatorServiceConfig;
  firestore?: FirebaseEmulatorServiceConfig;
  storage?: FirebaseEmulatorServiceConfig;
}

export function resolveFirebaseEmulatorHost(host: string): string {
  if (typeof window === 'undefined') {
    return host;
  }

  const normalizedHost = host.trim().toLowerCase();
  if (normalizedHost !== '127.0.0.1' && normalizedHost !== 'localhost') {
    return host;
  }

  const browserHost = window.location.hostname?.trim();
  if (!browserHost) {
    return host;
  }

  const normalizedBrowserHost = browserHost.toLowerCase();
  if (normalizedBrowserHost === '127.0.0.1' || normalizedBrowserHost === 'localhost') {
    return host;
  }

  return browserHost;
}
