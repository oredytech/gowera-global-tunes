
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RadioStation, getStationBySlug, searchStations } from '../services/api';
import { getApprovedRadioBySlug } from '../services/firebase';
import { StationCard } from '../components/StationCard';
import { SectionHeader } from '../components/SectionHeader';
import { Loader2 } from 'lucide-react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useIsMobile } from '../hooks/use-mobile';
import { Helmet } from 'react-helmet-async';
import { normalizeSlug } from '../services/openGraphService';
import { ShareButtons } from '../components/ShareButtons';
import placeholderImage from '/placeholder.svg';

const StationDetailsPage = () => {
  const { slug } = useParams();
  const { playStation, currentStation } = useAudioPlayer();
  const isMobile = useIsMobile();
  
  // Query standard radio API - first try exact slug match
  const { 
    data: radioApiStation, 
    isLoading: loadingRadioApi,
    error: radioApiError
  } = useQuery({
    queryKey: ['station', slug],
    queryFn: async () => {
      if (!slug) return null;
      console.log(`Fetching station with slug: ${slug}`);
      return await getStationBySlug(slug);
    },
    enabled: !!slug,
    retry: 1
  });
  
  // Fallback query - search by name if slug didn't work
  const {
    data: searchResults,
    isLoading: loadingSearch,
    error: searchError
  } = useQuery({
    queryKey: ['stations', 'search-fallback', slug],
    queryFn: async () => {
      if (!slug) return [];
      const searchTerm = slug.replace(/-/g, ' ');
      console.log(`Fallback search for: ${searchTerm}`);
      return await searchStations(searchTerm, 5);
    },
    enabled: !!slug && !radioApiStation && !loadingRadioApi,
  });
  
  // Query custom approved radios
  const {
    data: approvedRadio,
    isLoading: loadingApprovedRadio
  } = useQuery({
    queryKey: ['approvedRadios', slug],
    queryFn: async () => {
      if (!slug) return null;
      return await getApprovedRadioBySlug(slug);
    },
    enabled: !!slug && !radioApiStation && !loadingRadioApi,
  });

  // Merge results - use approved radio if radio API doesn't have results
  const isLoading = loadingRadioApi || loadingApprovedRadio || loadingSearch;
  
  // Try to find station from search results if direct lookup failed
  const fallbackStation = searchResults && searchResults.length > 0 ? searchResults[0] : null;
  
  // Convert approved radio to station format if needed
  const station = radioApiStation || fallbackStation || (approvedRadio ? {
    changeuuid: approvedRadio.id,
    stationuuid: approvedRadio.id,
    name: approvedRadio.radioName,
    url: approvedRadio.streamUrl,
    url_resolved: approvedRadio.streamUrl,
    favicon: approvedRadio.logoUrl || placeholderImage,
    homepage: approvedRadio.websiteUrl || '',
    country: approvedRadio.country || '',
    countrycode: '',
    language: approvedRadio.language || '',
    tags: approvedRadio.tags || '',
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
  } : null);

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
      <div className="flex flex-col justify-center items-center py-24 text-muted-foreground">
        <p className="mb-2">Station non trouvée</p>
        <p className="text-sm">
          {slug && `Impossible de trouver une station correspondant à "${slug.replace(/-/g, ' ')}"`}
        </p>
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
