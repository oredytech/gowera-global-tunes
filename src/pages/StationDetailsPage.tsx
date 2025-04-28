import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RadioStation } from '../services/radioApi';
import { StationCard } from '../components/StationCard';
import { SectionHeader } from '../components/SectionHeader';
import { Loader2 } from 'lucide-react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useIsMobile } from '../hooks/use-mobile';
import { Helmet } from 'react-helmet-async';
import { normalizeSlug } from '../services/openGraphService';
import { ShareButtons } from '../components/ShareButtons';

const StationDetailsPage = () => {
  const { slug } = useParams();
  const { playStation, currentStation } = useAudioPlayer();
  const isMobile = useIsMobile();
  
  const { data: station, isLoading } = useQuery<RadioStation | null>({
    queryKey: ['stations', 'search', slug],
    queryFn: async () => {
      const searchTerm = slug?.replace(/-/g, ' ');
      const stations = await fetch(`https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(searchTerm || '')}&limit=1`)
        .then(res => res.json());
      return stations.length > 0 ? stations[0] : null;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (station && (!currentStation || currentStation.stationuuid !== station.stationuuid)) {
      const timer = setTimeout(() => {
        playStation(station);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [station, playStation, currentStation]);

  useEffect(() => {
    if (station) {
      document.title = `${station.name} - GOWERA`;
    }
  }, [station]);

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

  const stationImage = station.favicon && station.favicon !== '' 
    ? station.favicon 
    : 'https://gowera.lovable.app/placeholder.svg';
  
  const stationDescription = station.tags 
    ? `${station.name} - ${station.country || 'Radio'} - ${station.tags.split(',').slice(0, 3).join(', ')}`
    : `${station.name} - ${station.country || 'Radio'}`;

  return (
    <>
      <Helmet>
        <title>{`${station.name} - GOWERA`}</title>
        <meta name="description" content={stationDescription} />
        <meta property="og:title" content={`${station.name} - GOWERA`} />
        <meta property="og:description" content={stationDescription} />
        <meta property="og:image" content={stationImage} />
        <meta property="og:url" content={`https://gowera.lovable.app/station/${normalizeSlug(station.name)}`} />
        <meta property="og:type" content="music.radio_station" />
        <link rel="canonical" href={`https://gowera.lovable.app/station/${normalizeSlug(station.name)}`} />
      </Helmet>

      <div className="space-y-6 md:space-y-8 w-full max-w-3xl mx-auto px-2 md:px-0">
        <SectionHeader 
          title={station.name}
          description={`${station.country || 'Pays inconnu'} • ${station.tags?.split(',')[0] || 'Radio'}`}
          className="break-words"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="w-full space-y-4">
            <StationCard station={station} />
            <ShareButtons 
              url={window.location.href}
              title={`Écoutez ${station.name} sur GOWERA`}
            />
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
    </>
  );
};

export default StationDetailsPage;
