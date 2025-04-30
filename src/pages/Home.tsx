
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPopularStations, getTrendingStations, getRandomStations } from '../services/radioApi';
import { getNewlyApprovedRadios, ApprovedRadio } from '../services/firebaseService';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';
import { NewRadiosGrid } from '../components/NewRadiosGrid';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';

const Home = () => {
  const audioPlayer = useAudioPlayer();
  const {
    data: popularStations,
    isLoading: loadingPopular
  } = useQuery({
    queryKey: ['popularStations'],
    queryFn: () => getPopularStations()
  });
  const {
    data: trendingStations,
    isLoading: loadingTrending
  } = useQuery({
    queryKey: ['trendingStations'],
    queryFn: () => getTrendingStations()
  });
  const {
    data: randomStations,
    isLoading: loadingRandom
  } = useQuery({
    queryKey: ['randomStations'],
    queryFn: () => getRandomStations(5)
  });
  const {
    data: newRadios,
    isLoading: loadingNewRadios
  } = useQuery({
    queryKey: ['newRadios'],
    queryFn: () => getNewlyApprovedRadios(6)
  });

  const playRandomStation = () => {
    if (randomStations && randomStations.length > 0) {
      const randomIndex = Math.floor(Math.random() * randomStations.length);
      const station = randomStations[randomIndex];
      audioPlayer.playStation(station);
    }
  };

  return (
    <div className="space-y-10">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-2">Bienvenue sur GOWERA</h1>
        <Button 
          onClick={playRandomStation} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <Shuffle className="h-4 w-4" />
          Radio aléatoire
        </Button>
      </div>
      
      {newRadios && newRadios.length > 0 && (
        <section>
          <SectionHeader 
            title="Nouvelles radios" 
            description="Les stations récemment ajoutées à GOWERA" 
          />
          <NewRadiosGrid radios={newRadios} isLoading={loadingNewRadios} />
        </section>
      )}
      
      <section>
        <SectionHeader 
          title="Tendances" 
          description="Les stations les plus écoutées en ce moment" 
          link="/popular" 
        />
        <StationGrid 
          stations={trendingStations?.slice(0, 10) || []} 
          isLoading={loadingTrending} 
        />
      </section>
      
      <section>
        <SectionHeader 
          title="Populaires" 
          description="Les stations les mieux notées" 
          link="/popular" 
        />
        <StationGrid 
          stations={popularStations?.slice(0, 10) || []} 
          isLoading={loadingPopular} 
        />
      </section>
      
      <section>
        <SectionHeader 
          title="Découvrir" 
          description="Essayez quelque chose de nouveau" 
        />
        <StationGrid 
          stations={randomStations || []} 
          isLoading={loadingRandom} 
        />
      </section>
    </div>
  );
};

export default Home;
