import React, { useEffect, useState } from 'react';
import { ApprovedRadio } from '../services/supabase';
import { Heart, BadgePlus, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { addFavorite, removeFavorite, isFavorite } from '../services/favoriteService';
import { voteForRadio, hasUserVoted, removeVoteForRadio } from '../services/supabase';
import { toast } from 'sonner';
import placeholderImage from '/placeholder.svg';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { normalizeSlug } from '../services/openGraphService';
import { useAuth } from '../contexts/SupabaseAuthContext';

interface NewRadioCardProps {
  radio: ApprovedRadio;
}

export const NewRadioCard: React.FC<NewRadioCardProps> = ({ radio }) => {
  const { playStation, currentStation, isPlaying } = useAudioPlayer();
  const [favorite, setFavorite] = useState(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [votes, setVotes] = useState(radio.votes || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const { currentUser } = useAuth();
  
  // Check if the radio is a favorite when the component loads
  useEffect(() => {
    const checkFavorite = async () => {
      const isFav = await isFavorite(radio.id);
      setFavorite(isFav);
    };
    
    checkFavorite();
  }, [radio.id]);

  // Check if user has voted
  useEffect(() => {
    const checkVote = async () => {
      if (currentUser) {
        const voted = await hasUserVoted(radio.id);
        setHasVoted(voted);
      }
    };
    
    checkVote();
  }, [radio.id, currentUser]);

  // Listen for favorites updated events
  useEffect(() => {
    const handleFavoritesUpdated = async () => {
      const isFav = await isFavorite(radio.id);
      setFavorite(isFav);
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
    };
  }, [radio.id]);
  
  // Convert ApprovedRadio to format expected by AudioPlayer
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const tagsString = Array.isArray(radio.tags) ? radio.tags.join(', ') : radio.tags || '';
    
    // Create a RadioStation object that the playStation function expects
    playStation({
      changeuuid: radio.id,
      stationuuid: radio.id,
      name: radio.name,
      url: radio.stream_url,
      url_resolved: radio.stream_url,
      favicon: radio.logo_url || placeholderImage,
      homepage: radio.website || '',
      country: radio.country || '',
      countrycode: '',
      language: radio.language || '',
      tags: tagsString,
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
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      if (favorite) {
        await removeFavorite(radio.id);
        toast.success(`${radio.name} retiré des favoris`);
      } else {
        await addFavorite(radio.id);
        toast.success(`${radio.name} ajouté aux favoris`);
      }
      
      setFavorite(!favorite);
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isVoting) return;
    
    if (!currentUser) {
      toast.error('Vous devez être connecté pour voter');
      return;
    }
    
    setIsVoting(true);
    
    try {
      if (hasVoted) {
        await removeVoteForRadio(radio.id);
        setVotes(v => v - 1);
        setHasVoted(false);
        toast.success('Vote retiré');
      } else {
        await voteForRadio(radio.id);
        setVotes(v => v + 1);
        setHasVoted(true);
        toast.success('Vote enregistré !');
      }
    } catch (error: any) {
      console.error('Error voting:', error);
      toast.error(error.message || 'Erreur lors du vote');
    } finally {
      setIsVoting(false);
    }
  };

  const isCurrentlyPlaying = currentStation?.url_resolved === radio.stream_url && isPlaying;
  const radioImage = radio.logo_url && radio.logo_url !== '' 
    ? radio.logo_url 
    : placeholderImage;

  // Format date to show how long ago the radio was approved
  const formatDateAgo = (dateString: string) => {
    const date = new Date(dateString);
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
  
  // Create a normalized slug for the radio URL
  const slug = radio.slug || normalizeSlug(radio.name);

  return (
    <div className={`block relative ${isCurrentlyPlaying ? 'border border-primary/50' : ''}`}>
      <Link 
        to={`/station/${slug}`}
        className="block cursor-pointer"
      >
        <div className="relative">
          <img
            src={radioImage}
            alt={radio.name}
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
        
        <h3 className="font-medium text-sm truncate">{radio.name}</h3>
        
        <div className="flex items-center justify-between mt-1 gap-2">
          <span className="text-xs text-muted-foreground truncate">
            {formatDateAgo(radio.created_at)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 px-2 gap-1 ${hasVoted ? 'text-primary' : ''}`}
            onClick={handleVote}
            disabled={isVoting}
          >
            <ThumbsUp className={`h-3 w-3 ${hasVoted ? 'fill-current' : ''}`} />
            <span className="text-xs">{votes}</span>
          </Button>
        </div>
      </Link>
    </div>
  );
};
