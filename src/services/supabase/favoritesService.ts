import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

// Fonction pour sauvegarder les favoris locaux
function saveLocalFavorites(favorites: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Migrer les favoris locaux vers Supabase
async function migrateLocalFavorites(userId: string): Promise<void> {
  const localFavorites = getLocalFavorites();
  if (localFavorites.length === 0) return;

  console.log(`Migrating ${localFavorites.length} local favorites to Supabase`);
  
  for (const stationId of localFavorites) {
    try {
      await supabase
        .from('favorites')
        .upsert({ user_id: userId, station_id: stationId }, { onConflict: 'user_id,station_id' });
    } catch (error) {
      console.error(`Error migrating favorite ${stationId}:`, error);
    }
  }
  
  // Clear local favorites after migration
  localStorage.removeItem(FAVORITES_KEY);
}

// Fonction pour obtenir les favoris
export async function getFavorites(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    try {
      // Migrate local favorites if any
      const localFavorites = getLocalFavorites();
      if (localFavorites.length > 0) {
        await migrateLocalFavorites(user.id);
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('station_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error getting favorites:', error);
        throw error;
      }

      return (data || []).map(f => f.station_id);
    } catch (error) {
      console.error('Error getting Supabase favorites:', error);
      toast.error("Impossible de récupérer vos favoris.");
      return getLocalFavorites();
    }
  } else {
    console.log("Utilisateur non connecté, récupération des favoris locaux");
    return getLocalFavorites();
  }
}

// Fonction pour ajouter un favori
export async function addFavorite(stationId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, station_id: stationId });

      if (error) {
        if (error.code === '23505') {
          // Already exists, ignore
          return;
        }
        throw error;
      }
      
      emitFavoritesUpdated();
    } catch (error) {
      console.error('Error adding favorite:', error);
      // Fallback to local storage
      const favorites = getLocalFavorites();
      if (!favorites.includes(stationId)) {
        favorites.push(stationId);
        saveLocalFavorites(favorites);
        emitFavoritesUpdated();
      }
    }
  } else {
    const favorites = getLocalFavorites();
    if (!favorites.includes(stationId)) {
      favorites.push(stationId);
      saveLocalFavorites(favorites);
      emitFavoritesUpdated();
    }
  }
}

// Fonction pour supprimer un favori
export async function removeFavorite(stationId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('station_id', stationId);

      if (error) throw error;
      
      emitFavoritesUpdated();
    } catch (error) {
      console.error('Error removing favorite:', error);
      // Fallback to local storage
      const favorites = getLocalFavorites();
      const newFavorites = favorites.filter(id => id !== stationId);
      saveLocalFavorites(newFavorites);
      emitFavoritesUpdated();
    }
  } else {
    const favorites = getLocalFavorites();
    const newFavorites = favorites.filter(id => id !== stationId);
    saveLocalFavorites(newFavorites);
    emitFavoritesUpdated();
  }
}

// Fonction pour vérifier si une station est un favori
export async function isFavorite(stationId: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(stationId);
}
