
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStationByUuid, RadioStation } from '../services/radioApi';
import { StationCard } from '../components/StationCard';
import { SectionHeader } from '../components/SectionHeader';
import { Loader2 } from 'lucide-react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useIsMobile } from '../hooks/use-mobile';

const StationDetailsPage = () => {
  const { stationId } = useParams();
  const { playStation, currentStation } = useAudioPlayer();
  const isMobile = useIsMobile();
  
  const { data: station, isLoading } = useQuery<RadioStation | null>({
    queryKey: ['station', stationId],
    queryFn: () => getStationByUuid(stationId || ''),
    enabled: !!stationId,
  });

  // Utiliser useEffect avec une vérification pour éviter les lectures multiples
  useEffect(() => {
    if (station && (!currentStation || currentStation.stationuuid !== station.stationuuid)) {
      // Petit délai pour éviter les conflits d'état
      const timer = setTimeout(() => {
        playStation(station);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [station, playStation, currentStation]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin mr-2" />
        <span>Chargement de la station...</span>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="flex justify-center items-center py-24 text-muted-foreground">
        Station non trouvée
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-3xl mx-auto px-2 md:px-0">
      <SectionHeader 
        title={station.name}
        description={`${station.country || 'Pays inconnu'} • ${station.tags?.split(',')[0] || 'Radio'}`}
        className="break-words"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="w-full">
          <StationCard station={station} />
        </div>
        
        <div className="space-y-4 overflow-hidden">
          <div>
            <h3 className="font-medium mb-2">Détails de la station</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Pays</dt>
                <dd className="break-words">{station.country || 'Non spécifié'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Langue</dt>
                <dd className="break-words">{station.language || 'Non spécifié'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Tags</dt>
                <dd className="break-words">{station.tags || 'Aucun tag'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Codec</dt>
                <dd className="break-words">{station.codec || 'Non spécifié'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Bitrate</dt>
                <dd>{station.bitrate ? `${station.bitrate} kbps` : 'Non spécifié'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Votes</dt>
                <dd>{station.votes || 0}</dd>
              </div>
            </dl>
          </div>
          
          {station.homepage && (
            <div>
              <h3 className="font-medium mb-2">Site web</h3>
              <a 
                href={station.homepage} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline break-words"
              >
                Visiter le site web
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationDetailsPage;
