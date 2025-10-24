
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
  apiKey: "AIzaSyDrj9qK-grctKlifciy7M4T4iF24kkUhhk",
  authDomain: "staysphere-82b5d.firebaseapp.com",
  projectId: "staysphere-82b5d",
  storageBucket: "staysphere-82b5d.firebasestorage.app",
  messagingSenderId: "510917404947",
  appId: "1:510917404947:web:2b1d1af311cd4967df52e6",
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