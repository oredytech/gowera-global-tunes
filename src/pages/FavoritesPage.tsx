
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '../services/favoriteService';
import { getStationByUuid, RadioStation } from '../services/radioApi';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "sonner";

const FavoritesPage = () => {
  const [favoriteStations, setFavoriteStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Utiliser React Query pour récupérer les IDs des favoris
  const { data: favoriteIds = [], isLoading: isLoadingIds, refetch } = useQuery({
    queryKey: ['favoriteIds', currentUser?.id],
    queryFn: getFavorites,
    meta: {
      onSettled: (data: string[] | undefined, error: Error | null) => {
        if (error) {
          console.error("Erreur lors de la récupération des favoris:", error);
          toast.error("Impossible de récupérer vos favoris. Veuillez réessayer plus tard.");
        } else if (data) {
          console.log(`${data.length} favoris récupérés:`, data);
        }
      }
    }
  });
  
  // Utiliser React Query pour récupérer toutes les stations favorites en parallèle
  const { data: stations = [], isLoading: isLoadingStations } = useQuery({
    queryKey: ['favoriteStations', favoriteIds],
    queryFn: async () => {
      // Si aucun favori, retourner un tableau vide
      if (favoriteIds.length === 0) {
        console.log("Aucun favori trouvé");
        return [];
      }
      
      try {
        console.log(`Récupération de ${favoriteIds.length} stations favorites`);
        // Récupérer toutes les stations en parallèle
        const stationPromises = favoriteIds.map(id => getStationByUuid(id));
        const results = await Promise.allSettled(stationPromises);
        
        // Filtrer les résultats réussis
        const successfulResults = results
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<RadioStation | null>).value)
          .filter(station => station !== null) as RadioStation[];
          
        console.log(`${successfulResults.length} stations favorites récupérées avec succès`);
        return successfulResults;
      } catch (error) {
        console.error("Erreur lors de la récupération des stations:", error);
        toast.error("Impossible de récupérer certaines stations. Veuillez réessayer plus tard.");
        return [];
      }
    },
    enabled: favoriteIds.length > 0,
  });
  
  // Écouter les événements de mise à jour des favoris
  useEffect(() => {
    const handleFavoritesUpdated = () => {
      console.log("Événement favoritesUpdated détecté, rafraîchissement des données");
      refetch();
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
    };
  }, [refetch]);
  
  // Mettre à jour l'état local lorsque les données de la requête changent
  useEffect(() => {
    setFavoriteStations(stations);
    setIsLoading(isLoadingIds || isLoadingStations);
  }, [stations, isLoadingIds, isLoadingStations]);

  console.log("Rendu de la page Favoris:", { 
    currentUser: currentUser?.id, 
    favoriteIds: favoriteIds.length, 
    favoriteStations: favoriteStations.length, 
    isLoading 
  });

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
