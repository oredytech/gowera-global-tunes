
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '../services/favoriteService';
import { getStationByUuid, RadioStation } from '../services/radioApi';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';

const FavoritesPage = () => {
  const [favoriteStations, setFavoriteStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const favoriteIds = getFavorites();
  
  // Use React Query to fetch all favorite stations in parallel
  const { data: stations = [] } = useQuery({
    queryKey: ['favoriteStations', favoriteIds],
    queryFn: async () => {
      // If no favorites, return empty array
      if (favoriteIds.length === 0) return [];
      
      // Fetch all stations in parallel
      const stationPromises = favoriteIds.map(id => getStationByUuid(id));
      const results = await Promise.all(stationPromises);
      
      // Filter out null results
      return results.filter(station => station !== null) as RadioStation[];
    },
  });
  
  useEffect(() => {
    setFavoriteStations(stations);
    setIsLoading(false);
  }, [stations]);

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
