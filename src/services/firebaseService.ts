import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, Timestamp, doc, updateDoc, query, where, getDocs, orderBy, limit } from "firebase/firestore";

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

// Interface for the approved radios to display
export interface ApprovedRadio {
  id: string;
  radioName: string;
  streamUrl: string;
  websiteUrl?: string;
  logoUrl?: string;
  description: string;
  approvedAt: Date;
}

// Fonction pour enregistrer une suggestion de radio
export async function saveRadioSuggestion(suggestion: Omit<RadioSuggestion, "createdAt" | "sponsored">): Promise<string> {
  try {
    // Ajouter des logs pour déboguer
    console.log("Début de saveRadioSuggestion avec les données :", suggestion);
    
    // Vérifier si les données requises sont présentes
    if (!suggestion.radioName || !suggestion.streamUrl || !suggestion.description || 
        !suggestion.contactEmail || !suggestion.contactPhone || !suggestion.senderEmail) {
      throw new Error("Des champs obligatoires sont manquants");
    }
    
    const docRef = await addDoc(collection(db, "radioSuggestions"), {
      ...suggestion,
      sponsored: false,
      createdAt: Timestamp.now()
    });
    
    console.log("Document ajouté avec ID: ", docRef.id);
    
    // Envoyer un email à l'administrateur (à implémenter plus tard avec Firebase Functions)
    // Ceci est simplement simulé pour le moment
    console.log(`Email would be sent to infosgowera@gmail.com about new radio suggestion: ${suggestion.radioName}`);
    
    return docRef.id;
  } catch (error) {
    console.error("Error saving radio suggestion:", error);
    throw error;
  }
}

// Fonction pour approuver une suggestion de radio
export async function approveRadioSuggestion(suggestionId: string): Promise<void> {
  try {
    const suggestionRef = doc(db, "radioSuggestions", suggestionId);
    await updateDoc(suggestionRef, {
      sponsored: true
    });
    
    console.log(`Radio suggestion with ID ${suggestionId} has been approved`);
    
    // Ici, vous pourriez également ajouter cette radio à une collection "radios" principale
    // avec plus de logique métier selon vos besoins
  } catch (error) {
    console.error("Error approving radio suggestion:", error);
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

// Fonction pour obtenir les radios approuvées les plus récentes
export async function getNewlyApprovedRadios(limitCount: number = 6): Promise<ApprovedRadio[]> {
  try {
    console.log(`Fetching newly approved radios, limit: ${limitCount}`);
    
    const approvedRadiosQuery = query(
      collection(db, "radioSuggestions"),
      where("sponsored", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(approvedRadiosQuery);
    
    const approvedRadios: ApprovedRadio[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      approvedRadios.push({
        id: doc.id,
        radioName: data.radioName,
        streamUrl: data.streamUrl,
        websiteUrl: data.websiteUrl || undefined,
        logoUrl: data.logoUrl || undefined,
        description: data.description,
        approvedAt: data.createdAt.toDate()
      });
    });
    
    console.log(`Found ${approvedRadios.length} newly approved radios`);
    return approvedRadios;
  } catch (error) {
    console.error("Error getting newly approved radios:", error);
    throw error;
  }
}
