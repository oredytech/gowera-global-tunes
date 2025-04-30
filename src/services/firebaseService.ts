
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

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
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

// Interface pour les suggestions de radio
export interface RadioSuggestion {
  radioName: string;
  streamUrl: string;
  websiteUrl?: string;
  logoUrl?: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  senderEmail: string;
  sponsored: boolean;
  createdAt: Date | Timestamp;
}

// Fonction pour enregistrer une suggestion de radio
export async function saveRadioSuggestion(suggestion: Omit<RadioSuggestion, "createdAt" | "sponsored">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "radioSuggestions"), {
      ...suggestion,
      sponsored: false,
      createdAt: Timestamp.now()
    });
    
    // Envoyer un email à l'administrateur (à implémenter plus tard avec Firebase Functions)
    // Ceci est simplement simulé pour le moment
    console.log(`Email would be sent to infosgowera@gmail.com about new radio suggestion: ${suggestion.radioName}`);
    
    return docRef.id;
  } catch (error) {
    console.error("Error saving radio suggestion:", error);
    throw error;
  }
}

// Fonction pour mettre à jour le statut de sponsoring d'une suggestion
export async function updateSponsorStatus(suggestionId: string, sponsored: boolean): Promise<void> {
  try {
    // Cette fonction sera implémentée plus tard lorsque nous aurons besoin de mettre à jour le statut de sponsoring
    console.log(`Updating sponsor status for ${suggestionId} to ${sponsored}`);
  } catch (error) {
    console.error("Error updating sponsor status:", error);
    throw error;
  }
}
