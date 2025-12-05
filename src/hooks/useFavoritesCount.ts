import { useState, useEffect } from 'react';
import { getFavorites } from '../services/favoriteService';
import { useAuth } from '../contexts/SupabaseAuthContext';

export const useFavoritesCount = () => {
  const [count, setCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fonction pour mettre à jour le compteur de favoris
    const updateFavoritesCount = async () => {
      try {
        const favorites = await getFavorites();
        setCount(favorites.length);
      } catch (error) {
        console.error('Error getting favorites count:', error);
        setCount(0);
      }
    };

    // Appel initial
    updateFavoritesCount();

    // Événement personnalisé pour détecter les changements de favoris
    const handleFavoritesChange = () => {
      updateFavoritesCount();
    };

    // Écouter les événements de stockage pour les utilisateurs non connectés
    window.addEventListener('storage', handleFavoritesChange);

    // Créer et écouter un événement personnalisé pour les mises à jour de favoris
    window.addEventListener('favoritesUpdated', handleFavoritesChange);

    return () => {
      window.removeEventListener('storage', handleFavoritesChange);
      window.removeEventListener('favoritesUpdated', handleFavoritesChange);
    };
  }, [currentUser]); // Re-exécuter l'effet si l'utilisateur change

  return count;
};
