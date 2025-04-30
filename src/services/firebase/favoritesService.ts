
import { collection, addDoc, Timestamp, doc, updateDoc, query, where, getDocs, setDoc } from "firebase/firestore";
import { db } from "./config";
import { getAuth } from "firebase/auth";
import { toast } from "sonner";

// Nouvelle fonction pour sauvegarder les favoris d'un utilisateur dans Firestore
export async function saveFavorite(userId: string, stationId: string): Promise<void> {
  try {
    // Générer un ID unique basé sur l'ID station pour éviter les doublons
    const favoriteId = `${stationId}`;
    const favoriteRef = doc(db, "users", userId, "favorites", favoriteId);
    
    await setDoc(favoriteRef, {
      stationId,
      addedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error saving favorite:", error);
    toast.error("Impossible d'ajouter aux favoris. Veuillez réessayer plus tard.");
    throw error;
  }
}

// Fonction pour récupérer les favoris d'un utilisateur
export async function getUserFavorites(userId: string): Promise<string[]> {
  try {
    const favoritesRef = collection(db, "users", userId, "favorites");
    const querySnapshot = await getDocs(favoritesRef);
    
    const favorites: string[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.deleted) {
        favorites.push(data.stationId);
      }
    });
    
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
    // Utiliser directement l'ID de document basé sur l'ID de la station
    const favoriteId = `${stationId}`;
    const favoriteRef = doc(db, "users", userId, "favorites", favoriteId);
    
    await updateDoc(favoriteRef, {
      deleted: true,
      deletedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    toast.error("Impossible de supprimer ce favori. Veuillez réessayer plus tard.");
    throw error;
  }
}
