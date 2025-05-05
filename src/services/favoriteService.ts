
import { RadioStation } from './api';
import { getUserFavorites, saveFavorite, removeFavoriteFromDb } from './firebase/favoritesService';
import { getAuth } from 'firebase/auth';
import { toast } from "sonner";

const FAVORITES_KEY = 'gowera_favorites';

// Fonction pour émettre un événement de mise à jour des favoris
function emitFavoritesUpdated() {
  console.log("Émission de l'événement favoritesUpdated");
  window.dispatchEvent(new Event('favoritesUpdated'));
}

// Fonction pour obtenir les favoris locaux (pour les utilisateurs non authentifiés)
function getLocalFavorites(): string[] {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting local favorites:', error);
    return [];
  }
}

// Fonction pour obtenir les favoris (en tenant compte de l'authentification)
export async function getFavorites(): Promise<string[]> {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  if (currentUser) {
    // Si l'utilisateur est connecté, récupérer les favoris depuis Firebase
    try {
      console.log(`Tentative de récupération des favoris pour ${currentUser.uid}`);
      const firebaseFavorites = await getUserFavorites(currentUser.uid);
      console.log(`Favoris Firebase récupérés: ${firebaseFavorites.length} favoris`);
      
      // Si aucun favori n'est trouvé dans Firebase et qu'il y a des favoris locaux,
      // nous pouvons les migrer vers Firebase
      if (firebaseFavorites.length === 0) {
        const localFavorites = getLocalFavorites();
        if (localFavorites.length > 0) {
          console.log(`Migration de ${localFavorites.length} favoris locaux vers Firebase`);
          for (const stationId of localFavorites) {
            try {
              await saveFavorite(currentUser.uid, stationId);
            } catch (error) {
              console.error(`Erreur lors de la migration du favori ${stationId}:`, error);
            }
          }
          // Après migration, récupérer à nouveau les favoris depuis Firebase
          return await getUserFavorites(currentUser.uid);
        }
      }
      
      return firebaseFavorites;
    } catch (error) {
      console.error('Error getting Firebase favorites:', error);
      toast.error("Impossible de récupérer vos favoris. Utilisation des favoris locaux.");
      return getLocalFavorites();
    }
  } else {
    // Sinon, récupérer les favoris depuis le localStorage
    console.log("Utilisateur non connecté, récupération des favoris locaux");
    return getLocalFavorites();
  }
}

// Fonction pour ajouter un favori
export async function addFavorite(stationUuid: string): Promise<void> {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  console.log("Tentative d'ajout d'un favori:", stationUuid, "Utilisateur connecté:", !!currentUser);
  
  if (currentUser) {
    // Si l'utilisateur est connecté, ajouter le favori à Firebase
    try {
      console.log(`Ajout du favori pour ${currentUser.uid}: ${stationUuid} dans Firebase`);
      await saveFavorite(currentUser.uid, stationUuid);
      console.log(`Favori ajouté pour ${currentUser.uid}: ${stationUuid}`);
      // Émettre un événement pour notifier les composants du changement
      emitFavoritesUpdated();
    } catch (error) {
      console.error('Error adding Firebase favorite:', error);
      // Fallback: ajouter au localStorage si Firebase échoue
      const favorites = getLocalFavorites();
      if (!favorites.includes(stationUuid)) {
        favorites.push(stationUuid);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        emitFavoritesUpdated();
      }
    }
  } else {
    // Sinon, ajouter le favori au localStorage
    try {
      const favorites = getLocalFavorites();
      if (!favorites.includes(stationUuid)) {
        favorites.push(stationUuid);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        emitFavoritesUpdated();
      }
    } catch (error) {
      console.error('Error adding local favorite:', error);
    }
  }
}

// Fonction pour supprimer un favori
export async function removeFavorite(stationUuid: string): Promise<void> {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  console.log("Tentative de suppression d'un favori:", stationUuid, "Utilisateur connecté:", !!currentUser);
  
  if (currentUser) {
    // Si l'utilisateur est connecté, supprimer le favori de Firebase
    try {
      console.log(`Suppression du favori pour ${currentUser.uid}: ${stationUuid} dans Firebase`);
      await removeFavoriteFromDb(currentUser.uid, stationUuid);
      console.log(`Favori supprimé pour ${currentUser.uid}: ${stationUuid}`);
      emitFavoritesUpdated();
    } catch (error) {
      console.error('Error removing Firebase favorite:', error);
      // Fallback: supprimer du localStorage si Firebase échoue
      const favorites = getLocalFavorites();
      const newFavorites = favorites.filter(id => id !== stationUuid);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      emitFavoritesUpdated();
    }
  } else {
    // Sinon, supprimer le favori du localStorage
    try {
      const favorites = getLocalFavorites();
      const newFavorites = favorites.filter(id => id !== stationUuid);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      emitFavoritesUpdated();
    } catch (error) {
      console.error('Error removing local favorite:', error);
    }
  }
}

// Fonction pour vérifier si une station est un favori
export async function isFavorite(stationUuid: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(stationUuid);
}
