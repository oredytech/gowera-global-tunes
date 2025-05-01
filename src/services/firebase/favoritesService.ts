
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
    
    console.log(`Tentative d'ajout du favori: ${stationId} pour l'utilisateur ${userId}`);
    
    // Vérifier si l'utilisateur est autorisé à écrire dans la collection favorites
    console.log("Vérification des permissions de l'utilisateur...");
    
    try {
      // Générer un ID unique basé sur l'ID station pour éviter les doublons
      const favoriteRef = doc(db, "favorites", `${userId}_${stationId}`);
      
      await setDoc(favoriteRef, {
        userId,
        stationId,
        addedAt: Timestamp.now()
      });
      
      console.log(`Favori ajouté avec succès: ${stationId} pour l'utilisateur ${userId}`);
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.error("Erreur de permission: L'utilisateur n'est pas autorisé à écrire dans la collection favorites.");
        toast.error("Vous n'avez pas l'autorisation d'ajouter des favoris. Veuillez contacter l'administrateur.");
      } else {
        console.error("Error saving favorite:", error);
        toast.error("Impossible d'ajouter aux favoris. Veuillez réessayer plus tard.");
      }
      throw error;
    }
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
    
    try {
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
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.error("Erreur de permission: L'utilisateur n'est pas autorisé à lire la collection favorites.");
        toast.error("Vous n'avez pas l'autorisation de voir vos favoris. Veuillez contacter l'administrateur.");
        return [];
      }
      throw error;
    }
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
    
    console.log(`Tentative de suppression du favori: ${stationId} pour l'utilisateur ${userId}`);
    
    try {
      // Utiliser l'ID composé pour retrouver le document
      const favoriteRef = doc(db, "favorites", `${userId}_${stationId}`);
      await deleteDoc(favoriteRef);
      
      console.log(`Favori supprimé avec succès: ${stationId} pour l'utilisateur ${userId}`);
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.error("Erreur de permission: L'utilisateur n'est pas autorisé à supprimer dans la collection favorites.");
        toast.error("Vous n'avez pas l'autorisation de supprimer des favoris. Veuillez contacter l'administrateur.");
      } else {
        console.error("Error removing favorite:", error);
        toast.error("Impossible de supprimer ce favori. Veuillez réessayer plus tard.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
    toast.error("Impossible de supprimer ce favori. Veuillez réessayer plus tard.");
    throw error;
  }
}
