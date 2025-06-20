import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // NEUER IMPORT

// Ihr persönlicher Firebase-Konfigurationsblock
const firebaseConfig = {
  apiKey: "AIzaSyDEGu_saAwMf7mrIUYb5gRqYLn-2nVLTXo",
  authDomain: "greensuspension-app.firebaseapp.com",
  projectId: "greensuspension-app",
  storageBucket: "greensuspension-app.appspot.com", // KORREKTUR VOM LETZTEN MAL
  messagingSenderId: "209222546081",
  appId: "1:209222546081:web:5ad58cc3163b2944af36e0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // NEUER EXPORT
