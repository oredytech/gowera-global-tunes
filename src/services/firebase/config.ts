
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

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
export const functions = getFunctions(app);

// Connecter à l'émulateur des fonctions en développement si nécessaire
// Décommenter pour utiliser l'émulateur local
// if (import.meta.env.DEV) {
//   connectFunctionsEmulator(functions, "localhost", 5001);
// }

// NOTE IMPORTANTE: 
// Un index Firestore est requis pour les requêtes sur radioSuggestions.
// Si vous voyez l'erreur "The query requires an index", visitez le lien ci-dessous:
// https://console.firebase.google.com/v1/r/project/gowera-83696/firestore/indexes?create_composite=ClVwcm9qZWN0cy9nb3dlcmEtODM2OTYvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3JhZGlvU3VnZ2VzdGlvbnMvaW5kZXhlcy9fEAEaDQoJc3BvbnNvcmVkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg
