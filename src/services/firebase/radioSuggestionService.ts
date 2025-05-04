
import { collection, addDoc, Timestamp, doc, updateDoc, query, where, getDocs, orderBy, limit, getDoc } from "firebase/firestore";
import { db } from "./config";
import { RadioSuggestion, ApprovedRadio } from "./types";
import { normalizeSlug } from "../openGraphService";

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
    
    // Envoyer un email à l'administrateur (à implémenter plus tard avec Firebase Functions)
    // Ceci est simplement simulé pour le moment
    console.log(`Email would be sent to infosgowera@gmail.com about new radio suggestion: ${suggestion.radioName}`);
    
    return docRef.id;
  } catch (error) {
    console.error("Error saving radio suggestion:", error);
    throw error;
  }
}

// Fonction pour récupérer les suggestions de radio en attente
export async function getPendingRadioSuggestions(): Promise<RadioSuggestion[]> {
  try {
    const pendingRadiosQuery = query(
      collection(db, "radioSuggestions"),
      where("sponsored", "==", false),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(pendingRadiosQuery);
    
    const pendingRadios: RadioSuggestion[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      pendingRadios.push({
        id: doc.id,
        radioName: data.radioName,
        streamUrl: data.streamUrl,
        websiteUrl: data.websiteUrl || undefined,
        logoUrl: data.logoUrl || undefined,
        description: data.description,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        senderEmail: data.senderEmail,
        createdAt: data.createdAt.toDate(),
        sponsored: data.sponsored,
        country: data.country,
        language: data.language,
        tags: data.tags
      });
    });
    
    return pendingRadios;
  } catch (error) {
    console.error("Error getting pending radio suggestions:", error);
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

// Fonction pour rejeter une suggestion de radio
export async function rejectRadioSuggestion(suggestionId: string): Promise<void> {
  try {
    // Pour l'instant, nous allons simplement supprimer le document
    // Mais vous pourriez préférer mettre à jour un champ "rejected" à true
    const suggestionRef = doc(db, "radioSuggestions", suggestionId);
    await updateDoc(suggestionRef, {
      rejected: true
    });
    
    console.log(`Radio suggestion with ID ${suggestionId} has been rejected`);
  } catch (error) {
    console.error("Error rejecting radio suggestion:", error);
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
    
    // Créer une requête pour les radios approuvées
    // Cette requête nécessite un index composite sur "sponsored" et "createdAt"
    console.log("Création de la requête pour les radios approuvées");
    const approvedRadiosQuery = query(
      collection(db, "radioSuggestions"),
      where("sponsored", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    console.log("Exécution de la requête...");
    const querySnapshot = await getDocs(approvedRadiosQuery);
    
    const approvedRadios: ApprovedRadio[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Données de la radio récupérées:", doc.id, data);
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
    // Afficher l'erreur complète pour récupérer le lien de création de l'index
    if (error instanceof Error) {
      console.error("Detailed error message:", error.message);
      
      // Si l'erreur contient un lien vers la création d'un index
      if (error.message.includes('https://console.firebase.google.com')) {
        console.error("Pour résoudre cette erreur, veuillez créer l'index en suivant ce lien dans le message d'erreur ci-dessus");
      }
    }
    throw error;
  }
}

// Fonction pour récupérer une radio approuvée par son slug
export async function getApprovedRadioBySlug(slug: string): Promise<ApprovedRadio | null> {
  try {
    console.log(`Looking for radio with slug: ${slug}`);
    
    // Récupérer toutes les radios approuvées (limité à 100 pour des raisons de performance)
    const approvedRadiosQuery = query(
      collection(db, "radioSuggestions"),
      where("sponsored", "==", true),
      limit(100)
    );
    
    const querySnapshot = await getDocs(approvedRadiosQuery);
    
    // Parcourir les résultats pour trouver la radio avec le slug correspondant
    let foundRadio: ApprovedRadio | null = null;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const radioSlug = normalizeSlug(data.radioName);
      
      if (radioSlug === slug) {
        foundRadio = {
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
        };
      }
    });
    
    console.log(foundRadio ? `Found radio with slug ${slug}` : `No radio found with slug ${slug}`);
    return foundRadio;
  } catch (error) {
    console.error(`Error getting radio by slug ${slug}:`, error);
    throw error;
  }
}

// Fonction pour récupérer les radios approuvées par catégorie
export async function getApprovedRadiosByCategory(category: string): Promise<ApprovedRadio[]> {
  try {
    console.log(`Fetching approved radios by category: ${category}`);
    
    // Récupérer toutes les radios approuvées
    const approvedRadiosQuery = query(
      collection(db, "radioSuggestions"),
      where("sponsored", "==", true),
      limit(100) // Limiter pour des raisons de performance
    );
    
    const querySnapshot = await getDocs(approvedRadiosQuery);
    
    const approvedRadios: ApprovedRadio[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Vérifier si la radio correspond à la catégorie recherchée
      // Note: On suppose que les tags sont stockés sous forme de chaîne séparée par des virgules
      if (data.tags && data.tags.toLowerCase().includes(category.toLowerCase())) {
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
      }
    });
    
    console.log(`Found ${approvedRadios.length} radios in category ${category}`);
    return approvedRadios;
  } catch (error) {
    console.error(`Error getting radios by category ${category}:`, error);
    throw error;
  }
}
