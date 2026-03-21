import { FirebaseWebConfig } from '../app/firebase/firebase-web-config';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
  apiKey: "AIzaSyCAwoy7LYvSXy9rmlito7YvyOClhUK1UkY",
  authDomain: "aspenleafshelties.firebaseapp.com",
  projectId: "aspenleafshelties",
  storageBucket: "aspenleafshelties.appspot.com",
  messagingSenderId: "411140458156",
  appId: "1:411140458156:web:50803751e94d6e5a96c109"
}
};
