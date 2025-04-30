
import { collection, addDoc, Timestamp, doc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./config";

// Nouvelle fonction pour sauvegarder les favoris d'un utilisateur dans Firestore
export async function saveFavorite(userId: string, stationId: string): Promise<void> {
  try {
    const favoriteRef = collection(db, "users", userId, "favorites");
    await addDoc(favoriteRef, {
      stationId,
      addedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error saving favorite:", error);
    throw error;
  }
}

// Fonction pour récupérer les favoris d'un utilisateur
export async function getUserFavorites(userId: string): Promise<string[]> {
  try {
    // Si l'utilisateur n'est pas connecté, retourner un tableau vide
    if (!userId) return [];
    
    const favoritesRef = collection(db, "users", userId, "favorites");
    const querySnapshot = await getDocs(favoritesRef);
    
    const favorites: string[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.stationId) {
        favorites.push(data.stationId);
      }
    });
    
    return favorites;
  } catch (error) {
    console.error("Error getting user favorites:", error);
    // En cas d'erreur de permissions ou autre, retourner un tableau vide
    return [];
  }
}

// Fonction pour supprimer un favori
export async function removeFavoriteFromDb(userId: string, stationId: string): Promise<void> {
  try {
    // Si l'utilisateur n'est pas connecté, ne rien faire
    if (!userId) return;
    
    const favoritesRef = collection(db, "users", userId, "favorites");
    const q = query(favoritesRef, where("stationId", "==", stationId));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (document) => {
      await updateDoc(doc(db, "users", userId, "favorites", document.id), {
        deleted: true,
        deletedAt: Timestamp.now()
      });
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
}
