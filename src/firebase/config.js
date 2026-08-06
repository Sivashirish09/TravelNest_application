import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Helper to retrieve active Firebase configuration from env or runtime override
const getActiveFirebaseConfig = () => {
  let customConfig = null;
  try {
    const saved = localStorage.getItem('travelnest_custom_firebase_config');
    if (saved) customConfig = JSON.parse(saved);
  } catch (e) {}

  return {
    apiKey: customConfig?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_TripPlanner2c635PlaceholderKey",
    projectId: customConfig?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || "trip-planner-2c635",
    storageBucket: customConfig?.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "trip-planner-2c635.appspot.com",
    messagingSenderId: customConfig?.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "666188515878",
    appId: customConfig?.appId || import.meta.env.VITE_FIREBASE_APP_ID || "1:666188515878:web:58ebce26f753a9dc8534e7"
  };
};

export const firebaseConfig = getActiveFirebaseConfig();

// Initialize Firebase App instance safely
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (err) {
  console.warn("Firebase App initialization notice:", err.message);
  app = getApps()[0] || initializeApp(firebaseConfig, 'travelnest-app');
}

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
