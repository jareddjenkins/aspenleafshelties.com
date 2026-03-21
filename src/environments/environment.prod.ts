import { FirebaseWebConfig } from '../app/firebase/firebase-web-config';
import { EnvironmentConfig } from './environment-config';

export const environment: EnvironmentConfig = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyCAwoy7LYvSXy9rmlito7YvyOClhUK1UkY',
    authDomain: 'aspenleafshelties.firebaseapp.com',
    projectId: 'aspenleafshelties',
    storageBucket: 'aspenleafshelties.appspot.com',
    messagingSenderId: '411140458156',
    appId: '1:411140458156:web:50803751e94d6e5a96c109',
  } satisfies FirebaseWebConfig,
};
