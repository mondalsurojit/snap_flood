import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBYYHLysbi1-pyeDCHyFZ-YXMExyXBmoH0",
  authDomain: "snapflood-515b6.firebaseapp.com",
  projectId: "snapflood-515b6",
  storageBucket: "snapflood-515b6.firebasestorage.app",
  messagingSenderId: "531856534116",
  appId: "1:531856534116:web:f2743d39495445bef68d71"
};

/*
  1. Initialize Firebase
  2. Initialize Firebase Authentication
  3. Setup Google Provider
  4. Setup Apple Provider
*/

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export default app;