import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyALhX_s7ROa1APLeODcINyRKr2FXayYCZ8",
  authDomain: "divine-collections-4d7d0.firebaseapp.com",
  projectId: "divine-collections-4d7d0",
  storageBucket: "divine-collections-4d7d0.firebasestorage.app",
  messagingSenderId: "557296400783",
  appId: "1:557296400783:web:0ded6afca093c9a5d5b3fa"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);