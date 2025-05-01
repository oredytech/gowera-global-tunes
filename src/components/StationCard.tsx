
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RadioStation } from '../services/radioApi';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { isFavorite, addFavorite, removeFavorite } from '../services/favoriteService';
import { toast } from 'sonner';
import placeholderImage from '/placeholder.svg';
import { useAuth } from '../contexts/AuthContext';

interface StationCardProps {
  station: RadioStation;
}

export const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const { playStation, currentStation, isPlaying } = useAudioPlayer();
  const [favorite, setFavorite] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { currentUser } = useAuth();
  
  const isPlaying_ = currentStation?.stationuuid === station.stationuuid && isPlaying;

  // Vérifier si la station est un favori lors du chargement du composant
  useEffect(() => {
    const checkFavorite = async () => {
      const isFav = await isFavorite(station.stationuuid);
      setFavorite(isFav);
    };
    
    checkFavorite();
  }, [station.stationuuid]);

  // Écouter les événements de mise à jour des favoris
  useEffect(() => {
    const handleFavoritesUpdated = async () => {
      const isFav = await isFavorite(station.stationuuid);
      setFavorite(isFav);
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
    };
  }, [station.stationuuid]);

  const normalizeSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      console.log(`Clic sur favori pour ${station.name} (${station.stationuuid}). État actuel: ${favorite ? 'favori' : 'non favori'}`);
      console.log(`Utilisateur connecté: ${currentUser ? currentUser.id : 'non connecté'}`);
      
      if (favorite) {
        await removeFavorite(station.stationuuid);
        toast.success(`${station.name} retiré des favoris`);
      } else {
        await addFavorite(station.stationuuid);
        toast.success(`${station.name} ajouté aux favoris`);
      }
      
      setFavorite(!favorite);
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  const stationImage = station.favicon && station.favicon !== '' 
    ? station.favicon 
    : placeholderImage;

  const stationTags = station.tags ? station.tags.split(',').slice(0, 2) : [];

  return (
    <div className={`station-card block relative ${isPlaying_ ? 'border border-primary/50' : ''}`}>
      <Link 
        to={`/station/${normalizeSlug(station.name)}`}
        className="block"
      >
        <div className="relative">
          <img
            src={stationImage}
            alt={station.name}
            className="w-full aspect-square object-cover rounded-md mb-3"
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeholderImage;
            }}
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40"
            onClick={handleFavoriteClick}
            disabled={isProcessing}
          >
            <Heart 
              size={16} 
              className={favorite ? 'fill-gowera-red text-gowera-red' : ''}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40"
            onClick={(e) => {
              e.preventDefault();
              playStation(station);
            }}
          >
            {isPlaying_ ? (
              <span className="h-2 w-2 rounded-full bg-primary"></span>
            ) : null}
          </Button>
        </div>
        
        <h3 className="font-medium text-sm truncate">{station.name}</h3>
        
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-muted-foreground truncate">
            {station.country || 'Unknown'}
          </span>
        </div>
        
        {stationTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {stationTags.map((tag) => (
              <span 
                key={tag} 
                className="text-xs bg-secondary px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </div>
  );
};
