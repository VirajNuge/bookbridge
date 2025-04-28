// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGXZ9v3gLUUeQYz3bbx5QC_PoZvWHN_pA",
  authDomain: "book-bridge-3ee21.firebaseapp.com",
  projectId: "book-bridge-3ee21",
  storageBucket: "book-bridge-3ee21.appspot.com", // FIXED storage bucket URL
  messagingSenderId: "489327238002",
  appId: "1:489327238002:web:602d7948cd3bd68b449beb",
  measurementId: "G-6575J6C92Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Corrected
const db: Firestore = getFirestore(app);

// Export correctly
export { app, auth, db, signInWithEmailAndPassword };
