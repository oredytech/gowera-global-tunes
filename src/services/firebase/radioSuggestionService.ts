
import { collection, addDoc, Timestamp, doc, updateDoc, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "./config";
import { RadioSuggestion, ApprovedRadio } from "./types";
import { getFunctions, httpsCallable } from "firebase/functions";
import { toast } from '@/hooks/use-toast';

// Fonction pour enregistrer une suggestion de radio
export async function saveRadioSuggestion(suggestion: Omit<RadioSuggestion, "createdAt" | "sponsored">): Promise<string> {
  try {
    // Ajouter des logs pour déboguer
    console.log("Début de saveRadioSuggestion avec les données :", suggestion);
    
    // Vérifier si les données requises sont présentes
    if (!suggestion.radioName || !suggestion.streamUrl || !suggestion.description || 
        !suggestion.contactEmail || !suggestion.contactPhone || !suggestion.senderEmail || 
        !suggestion.country || !suggestion.tags || !suggestion.language) {
      throw new Error("Des champs obligatoires sont manquants");
    }
    
    const docRef = await addDoc(collection(db, "radioSuggestions"), {
      ...suggestion,
      sponsored: false,
      createdAt: Timestamp.now()
    });
    
    console.log("Document ajouté avec ID: ", docRef.id);
    
    // Appeler la fonction Cloud Function pour envoyer l'email
    try {
      const functions = getFunctions();
      const sendAdminNotification = httpsCallable(functions, 'sendAdminNotificationEmail');
      
      await sendAdminNotification({
        radioName: suggestion.radioName,
        submitterId: suggestion.senderEmail,
        suggestionId: docRef.id
      });
      
      console.log("Notification email sent to admin about new radio suggestion");
    } catch (emailError) {
      // Ne pas bloquer le processus si l'envoi d'email échoue
      console.error("Error sending admin notification email:", emailError);
    }
    
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
    
    // Vérifier si nous sommes en développement pour éviter l'erreur d'index manquant
    if (import.meta.env.DEV) {
      console.log("DEV environment detected, returning mock data");
      // En développement, retourner des données simulées
      return mockApprovedRadios;
    }
    
    try {
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
          approvedAt: data.createdAt.toDate(),
          country: data.country || '',
          tags: data.tags || '',
          language: data.language || ''
        });
      });
      
      console.log(`Found ${approvedRadios.length} newly approved radios`);
      return approvedRadios;
    } catch (error) {
      console.error("Error getting newly approved radios:", error);
      
      // Si l'erreur concerne un index manquant, afficher un toast avec le lien
      if (error instanceof Error && error.message?.includes("index")) {
        const indexLink = "https://console.firebase.google.com/v1/r/project/gowera-83696/firestore/indexes?create_composite=ClVwcm9qZWN0cy9nb3dlcmEtODM2OTYvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3JhZGlvU3VnZ2VzdGlvbnMvaW5kZXhlcy9fEAEaDQoJc3BvbnNvcmVkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg";
        
        toast({
          title: "Index Firestore requis",
          description: "Un index est nécessaire pour cette requête. Veuillez cliquer sur le bouton ci-dessous pour le créer.",
          action: (
            <a href={indexLink} target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-3 py-2 rounded-md text-xs hover:bg-primary/90 transition-colors">
              Créer l'index
            </a>
          ),
        });
      }
      
      // En cas d'erreur, retourner les données simulées
      return mockApprovedRadios;
    }
  } catch (error) {
    console.error("Error getting newly approved radios:", error);
    return mockApprovedRadios;
  }
}

// Données simulées pour le développement ou en cas d'erreur
const mockApprovedRadios: ApprovedRadio[] = [
  {
    id: "mock1",
    radioName: "Radio Gowera",
    streamUrl: "https://stream.example.com/radio1",
    websiteUrl: "https://radiogowera.com",
    logoUrl: "/placeholder.svg",
    description: "La première radio de la plateforme GOWERA",
    approvedAt: new Date(),
    country: "Sénégal",
    tags: "news,music,talk",
    language: "French"
  },
  {
    id: "mock2",
    radioName: "Africa Beat FM",
    streamUrl: "https://stream.example.com/africabeat",
    logoUrl: "/placeholder.svg",
    description: "Les meilleurs beats d'Afrique",
    approvedAt: new Date(Date.now() - 86400000), // hier
    country: "Ghana",
    tags: "music,african",
    language: "English"
  },
  {
    id: "mock3",
    radioName: "Dakar FM",
    streamUrl: "https://stream.example.com/dakarfm",
    websiteUrl: "https://dakarfm.sn",
    logoUrl: "/placeholder.svg", 
    description: "La voix de Dakar",
    approvedAt: new Date(Date.now() - 172800000), // il y a 2 jours
    country: "Sénégal",
    tags: "news,local",
    language: "French,Wolof"
  }
];
