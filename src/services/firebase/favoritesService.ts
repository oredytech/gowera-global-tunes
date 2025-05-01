
import { collection, addDoc, Timestamp, doc, updateDoc, query, where, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./config";
import { getAuth } from "firebase/auth";
import { toast } from "sonner";

// Fonction pour sauvegarder les favoris d'un utilisateur dans Firestore
export async function saveFavorite(userId: string, stationId: string): Promise<void> {
  try {
    if (!userId) {
      console.error("Aucun ID utilisateur fourni pour sauvegarder le favori");
      return;
    }
    
    // Générer un ID unique basé sur l'ID station pour éviter les doublons
    const favoriteRef = doc(db, "favorites", `${userId}_${stationId}`);
    
    await setDoc(favoriteRef, {
      userId,
      stationId,
      addedAt: Timestamp.now()
    });
    
    console.log(`Favori ajouté: ${stationId} pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error("Error saving favorite:", error);
    toast.error("Impossible d'ajouter aux favoris. Veuillez réessayer plus tard.");
    throw error;
  }
}

// Fonction pour récupérer les favoris d'un utilisateur
export async function getUserFavorites(userId: string): Promise<string[]> {
  try {
    if (!userId) {
      console.log("Aucun ID utilisateur fourni pour récupérer les favoris");
      return [];
    }
    
    console.log(`Récupération des favoris pour l'utilisateur: ${userId}`);
    const q = query(collection(db, "favorites"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const favorites: string[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.stationId) {
        favorites.push(data.stationId);
      }
    });
    
    console.log(`Favoris récupérés: ${favorites.length} stations`);
    return favorites;
  } catch (error) {
    console.error("Error getting user favorites:", error);
    toast.error("Impossible de récupérer vos favoris. Veuillez réessayer plus tard.");
    return [];
  }
}

// Fonction pour supprimer un favori
export async function removeFavoriteFromDb(userId: string, stationId: string): Promise<void> {
  try {
    if (!userId) return;
    
    // Utiliser l'ID composé pour retrouver le document
    const favoriteRef = doc(db, "favorites", `${userId}_${stationId}`);
    await deleteDoc(favoriteRef);
    
    console.log(`Favori supprimé: ${stationId} pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error("Error removing favorite:", error);
    toast.error("Impossible de supprimer ce favori. Veuillez réessayer plus tard.");
    throw error;
  }
}
