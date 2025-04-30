
import { RadioStation } from './radioApi';
import { getUserFavorites, saveFavorite, removeFavoriteFromDb } from './firebaseService';
import { getAuth } from 'firebase/auth';

const FAVORITES_KEY = 'gowera_favorites';

// Fonction pour émettre un événement de mise à jour des favoris
function emitFavoritesUpdated() {
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
    return await getUserFavorites(currentUser.uid);
  } else {
    // Sinon, récupérer les favoris depuis le localStorage
    return getLocalFavorites();
  }
}

// Fonction pour ajouter un favori
export async function addFavorite(stationUuid: string): Promise<void> {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  if (currentUser) {
    // Si l'utilisateur est connecté, ajouter le favori à Firebase
    await saveFavorite(currentUser.uid, stationUuid);
  } else {
    // Sinon, ajouter le favori au localStorage
    try {
      const favorites = getLocalFavorites();
      if (!favorites.includes(stationUuid)) {
        favorites.push(stationUuid);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding local favorite:', error);
    }
  }
  
  // Émettre un événement pour notifier les composants du changement
  emitFavoritesUpdated();
}

// Fonction pour supprimer un favori
export async function removeFavorite(stationUuid: string): Promise<void> {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  if (currentUser) {
    // Si l'utilisateur est connecté, supprimer le favori de Firebase
    await removeFavoriteFromDb(currentUser.uid, stationUuid);
  } else {
    // Sinon, supprimer le favori du localStorage
    try {
      const favorites = getLocalFavorites();
      const newFavorites = favorites.filter(id => id !== stationUuid);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error removing local favorite:', error);
    }
  }
  
  // Émettre un événement pour notifier les composants du changement
  emitFavoritesUpdated();
}

// Fonction pour vérifier si une station est un favori
export async function isFavorite(stationUuid: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(stationUuid);
}
