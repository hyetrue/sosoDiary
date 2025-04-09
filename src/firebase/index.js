import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: 'soso-diary-project.firebaseapp.com',
  projectId: 'soso-diary-project',
  storageBucket: 'soso-diary-project.appspot.com',
  messagingSenderId: '633031268712',
  appId: '1:633031268712:web:fb26b49285648e82e45edd',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
