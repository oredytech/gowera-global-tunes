
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBEkzSkX1D9UkeYP2lJrbg_FpcB-lhKOYg",
  authDomain: "gowera-83696.firebaseapp.com",
  projectId: "gowera-83696",
  storageBucket: "gowera-83696.firebasestorage.app",
  messagingSenderId: "433103254186",
  appId: "1:433103254186:web:1ca19cddc478315b5a96d3",
  measurementId: "G-8ZJQ7THMGL"
};

// Initialiser Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
