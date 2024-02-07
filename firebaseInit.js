import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from './firebaseConfig.js';

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export default app;
