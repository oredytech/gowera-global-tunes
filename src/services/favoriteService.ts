
import { RadioStation } from './radioApi';

const FAVORITES_KEY = 'gowera_favorites';

export function getFavorites(): string[] {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

export function addFavorite(stationUuid: string): void {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(stationUuid)) {
      favorites.push(stationUuid);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
}

export function removeFavorite(stationUuid: string): void {
  try {
    const favorites = getFavorites();
    const newFavorites = favorites.filter(id => id !== stationUuid);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
}

export function isFavorite(stationUuid: string): boolean {
  try {
    const favorites = getFavorites();
    return favorites.includes(stationUuid);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}
