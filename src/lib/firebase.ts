import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration for EduZone
export const firebaseConfig = {
  apiKey: "AIzaSyCyjCblxjBl1SW4_xHCwfbeZuBrUcL7tcs",
  authDomain: "eduzoneed.firebaseapp.com",
  projectId: "eduzoneed",
  storageBucket: "eduzoneed.firebasestorage.app",
  messagingSenderId: "543556855938",
  appId: "1:543556855938:web:c9cd49dcb0a87620e42c9b",
  measurementId: "G-0XVD2303XD"
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Firebase Analytics safely (only in client browser environments that support it)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn('[Firebase Analytics] Not supported in this environment:', err);
  });
}

// Expose storage globally for avatar helper compatibility
if (typeof window !== 'undefined') {
  (window as any).__firebaseApp = app;
  (window as any).__firebaseDb = db;
  (window as any).__firebaseAuth = auth;
  (window as any).__firebaseStorage = storage;
}
