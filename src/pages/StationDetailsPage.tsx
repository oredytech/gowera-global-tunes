import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStationByUuid, RadioStation } from '../services/radioApi';
import { StationCard } from '../components/StationCard';
import { SectionHeader } from '../components/SectionHeader';
import { Loader2 } from 'lucide-react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const StationDetailsPage = () => {
  const { stationId } = useParams();
  const { playStation } = useAudioPlayer();
  
  const { data: station, isLoading } = useQuery<RadioStation | null>({
    queryKey: ['station', stationId],
    queryFn: () => getStationByUuid(stationId || ''),
    enabled: !!stationId,
  });

  useEffect(() => {
    if (station) {
      playStation(station);
    }
  }, [station, playStation]);

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
    <div className="space-y-8 max-w-3xl mx-auto">
      <SectionHeader 
        title={station.name}
        description={`${station.country || 'Pays inconnu'} • ${station.tags?.split(',')[0] || 'Radio'}`}
      />
      
      <div className="grid md:grid-cols-2 gap-8">
        <StationCard station={station} />
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Détails de la station</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Pays</dt>
                <dd>{station.country || 'Non spécifié'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Langue</dt>
                <dd>{station.language || 'Non spécifié'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Tags</dt>
                <dd>{station.tags || 'Aucun tag'}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Codec</dt>
                <dd>{station.codec || 'Non spécifié'}</dd>
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
                className="text-primary hover:underline"
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
