import React from 'react';
import { Link } from 'react-router-dom';
import { RadioStation } from '../services/radioApi';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { isFavorite, addFavorite, removeFavorite } from '../services/favoriteService';
import { toast } from 'sonner';
import placeholderImage from '/placeholder.svg';

interface StationCardProps {
  station: RadioStation;
}

export const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const { playStation, currentStation, isPlaying } = useAudioPlayer();
  const [favorite, setFavorite] = React.useState(isFavorite(station.stationuuid));
  
  const isPlaying_ = currentStation?.stationuuid === station.stationuuid && isPlaying;
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (favorite) {
      removeFavorite(station.stationuuid);
      toast.success(`${station.name} retiré des favoris`);
    } else {
      addFavorite(station.stationuuid);
      toast.success(`${station.name} ajouté aux favoris`);
    }
    
    setFavorite(!favorite);
  };
  
  const stationImage = station.favicon && station.favicon !== '' 
    ? station.favicon 
    : placeholderImage;

  const stationTags = station.tags ? station.tags.split(',').slice(0, 2) : [];
  
  return (
    <Link 
      to={`/station/${station.stationuuid}`}
      className={`station-card block ${isPlaying_ ? 'border border-primary/50' : ''}`}
    >
      <div 
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          playStation(station);
        }}
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
          >
            <Heart 
              size={16} 
              className={favorite ? 'fill-gowera-red text-gowera-red' : ''}
            />
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
      </div>
    </Link>
  );
};
