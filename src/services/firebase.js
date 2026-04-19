// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtQTXY_uEYl0YR-0BWmRHX0IiQCk39tvg",
  authDomain: "eco-log-2.firebaseapp.com",
  projectId: "eco-log-2",
  storageBucket: "eco-log-2.firebasestorage.app",
  messagingSenderId: "59406111419",
  appId: "1:59406111419:web:38ab67e7c5e77024130f9e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);