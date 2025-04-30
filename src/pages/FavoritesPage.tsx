
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '../services/favoriteService';
import { getStationByUuid, RadioStation } from '../services/radioApi';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';
import { useAuth } from '../contexts/AuthContext';

const FavoritesPage = () => {
  const [favoriteStations, setFavoriteStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Utiliser React Query pour récupérer les IDs des favoris
  const { data: favoriteIds = [], isLoading: isLoadingIds } = useQuery({
    queryKey: ['favoriteIds', currentUser?.id],
    queryFn: getFavorites,
  });
  
  // Utiliser React Query pour récupérer toutes les stations favorites en parallèle
  const { data: stations = [], isLoading: isLoadingStations } = useQuery({
    queryKey: ['favoriteStations', favoriteIds],
    queryFn: async () => {
      // Si aucun favori, retourner un tableau vide
      if (favoriteIds.length === 0) return [];
      
      // Récupérer toutes les stations en parallèle
      const stationPromises = favoriteIds.map(id => getStationByUuid(id));
      const results = await Promise.all(stationPromises);
      
      // Filtrer les résultats nuls
      return results.filter(station => station !== null) as RadioStation[];
    },
    enabled: favoriteIds.length > 0,
  });
  
  useEffect(() => {
    setFavoriteStations(stations);
    setIsLoading(isLoadingIds || isLoadingStations);
  }, [stations, isLoadingIds, isLoadingStations]);

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Vos Favoris" 
        description="Les radios que vous avez ajoutées à vos favoris" 
      />
      
      <StationGrid 
        stations={favoriteStations} 
        isLoading={isLoading}
        emptyMessage="Vous n'avez pas encore de favoris. Explorez les radios et cliquez sur le cœur pour en ajouter!"
      />
    </div>
  );
};

export default FavoritesPage;
