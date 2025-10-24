
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// =================================================================
// IMPORTANT: FIREBASE CONFIGURATION
// =================================================================
// Replace the placeholder values below with your actual Firebase project's configuration.
// You can find this in the Firebase Console:
// Project settings > General > Your apps > Firebase SDK snippet > Config
//
// The app will not work until you configure this correctly.
const firebaseConfig = {
  apiKey: "PASTE_YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "PASTE_YOUR_FIREBASE_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_FIREBASE_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_FIREBASE_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_FIREBASE_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_FIREBASE_APP_ID_HERE",
};

// Check if the configuration is still using placeholder values.
export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PASTE_YOUR");


// Initialize Firebase
// This will throw an error if the config is invalid once used. Check your browser's
// developer console for details if the app fails to load after configuration.
const app: FirebaseApp = initializeApp(firebaseConfig);

// Export Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;