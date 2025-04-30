
import React from 'react';
import { ApprovedRadio } from '../services/firebaseService';
import { Heart, BadgePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { addFavorite, removeFavorite, isFavorite } from '../services/favoriteService';
import { toast } from 'sonner';
import placeholderImage from '/placeholder.svg';
import { Badge } from '@/components/ui/badge';

interface NewRadioCardProps {
  radio: ApprovedRadio;
}

export const NewRadioCard: React.FC<NewRadioCardProps> = ({ radio }) => {
  const { playStation, currentStation, isPlaying } = useAudioPlayer();
  const [favorite, setFavorite] = React.useState(false);
  
  // Convert ApprovedRadio to format expected by AudioPlayer
  const handlePlay = () => {
    // Create a RadioStation object that the playStation function expects
    playStation({
      changeuuid: radio.id,
      stationuuid: radio.id,
      name: radio.radioName,
      url: radio.streamUrl,
      url_resolved: radio.streamUrl,
      favicon: radio.logoUrl || placeholderImage,
      homepage: radio.websiteUrl || '',
      country: '', // Set default empty string instead of radio.country
      countrycode: '',
      state: '',
      language: '',
      tags: '', // Set default empty string instead of radio.tags
      votes: 0,
      codec: '',
      bitrate: 0,
      lastcheckok: 1, // Changed from boolean true to number 1
      lastchecktime: '',
      lastcheckoktime: '',
      clicktimestamp: '',
      clickcount: 0,
      clicktrend: 0,
      ssl_error: 0,
      geo_lat: null,
      geo_long: null,
      has_extended_info: false
    });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      // We don't have a station UUID for these radios, so we'll just use the ID
      removeFavorite(radio.id);
      toast.success(`${radio.radioName} retiré des favoris`);
    } else {
      // We don't have a station UUID for these radios, so we'll just use the ID
      addFavorite(radio.id); 
      toast.success(`${radio.radioName} ajouté aux favoris`);
    }
    
    setFavorite(!favorite);
  };

  const isCurrentlyPlaying = currentStation?.url_resolved === radio.streamUrl && isPlaying;
  const radioImage = radio.logoUrl && radio.logoUrl !== '' 
    ? radio.logoUrl 
    : placeholderImage;

  // Format date to show how long ago the radio was approved
  const formatDateAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else {
      return `Il y a ${diffDays} jours`;
    }
  };

  return (
    <div className={`block relative ${isCurrentlyPlaying ? 'border border-primary/50' : ''}`}>
      <div 
        onClick={handlePlay}
        className="cursor-pointer"
      >
        <div className="relative">
          <img
            src={radioImage}
            alt={radio.radioName}
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

          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 bg-green-500/80 text-white hover:bg-green-600"
          >
            <BadgePlus className="h-3 w-3 mr-1" /> Nouveau
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40"
            onClick={handlePlay}
          >
            {isCurrentlyPlaying ? (
              <span className="h-2 w-2 rounded-full bg-primary"></span>
            ) : null}
          </Button>
        </div>
        
        <h3 className="font-medium text-sm truncate">{radio.radioName}</h3>
        
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-muted-foreground truncate">
            {formatDateAgo(radio.approvedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};
