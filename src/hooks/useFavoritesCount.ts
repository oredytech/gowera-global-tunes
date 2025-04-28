
import { useState, useEffect } from 'react';
import { getFavorites } from '../services/favoriteService';

export const useFavoritesCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const favorites = getFavorites();
    setCount(favorites.length);

    // Listen for storage changes to update count
    const handleStorageChange = () => {
      const favorites = getFavorites();
      setCount(favorites.length);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return count;
};
