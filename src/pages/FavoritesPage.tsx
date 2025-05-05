
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '../services/favoriteService';
import { getStationByUuid, RadioStation } from '../services/api';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "sonner";
import { getApprovedRadioBySlug } from '../services/firebase';
import placeholderImage from '/placeholder.svg';
import { normalizeSlug } from '../services/openGraphService';

const FavoritesPage = () => {
  const [favoriteStations, setFavoriteStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Utiliser React Query pour récupérer les IDs des favoris
  const { data: favoriteIds = [], isLoading: isLoadingIds, refetch } = useQuery({
    queryKey: ['favoriteIds', currentUser?.id],
    queryFn: async () => {
      console.log("Récupération des IDs de favoris, utilisateur connecté:", !!currentUser);
      if (currentUser) {
        console.log("ID utilisateur:", currentUser.id);
      }
      try {
        const favorites = await getFavorites();
        console.log(`${favorites.length} favoris récupérés:`, favorites);
        return favorites;
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error);
        toast.error("Impossible de récupérer vos favoris. Veuillez réessayer plus tard.");
        return [];
      }
    },
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
        
        // Pour chaque ID favori, essayer de récupérer depuis radio-browser.info ou depuis Firebase
        const allStations: RadioStation[] = [];
        
        for (const id of favoriteIds) {
          try {
            // D'abord essayer de récupérer depuis radio-browser.info
            const station = await getStationByUuid(id);
            if (station) {
              allStations.push(station);
              continue;
            }
            
            // Si ça ne marche pas, essayer de récupérer depuis Firebase
            // Les radios approuvées dans Firebase peuvent avoir été mises en favoris
            // On va essayer de récupérer toutes les radios approuvées et filtrer par ID
            const allApprovedRadios = await getApprovedRadioBySlug(id);
            if (allApprovedRadios) {
              // Convertir la radio approuvée en format RadioStation pour l'affichage
              allStations.push({
                changeuuid: allApprovedRadios.id,
                stationuuid: allApprovedRadios.id,
                name: allApprovedRadios.radioName,
                url: allApprovedRadios.streamUrl,
                url_resolved: allApprovedRadios.streamUrl,
                favicon: allApprovedRadios.logoUrl || placeholderImage,
                homepage: allApprovedRadios.websiteUrl || '',
                country: allApprovedRadios.country || '',
                countrycode: '',
                language: allApprovedRadios.language || '',
                tags: allApprovedRadios.tags || '',
                votes: 0,
                codec: '',
                bitrate: 0,
                lastcheckok: 1,
                lastchecktime: '',
                lastcheckoktime: '',
                clicktimestamp: '',
                clickcount: 0,
                clicktrend: 0,
                hls: 0,
                lastchangetime: '',
                lastlocalchecktime: ''
              });
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération de la station ${id}:`, error);
          }
        }
          
        console.log(`${allStations.length} stations favorites récupérées avec succès`);
        return allStations;
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
