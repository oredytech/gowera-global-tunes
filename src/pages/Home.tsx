import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPopularStations, getTrendingStations, getRandomStations } from '../services/radioApi';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';
import { Button } from '@/components/ui/button';
import { Play, Radio } from 'lucide-react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

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

  const playRandomStation = () => {
    if (randomStations && randomStations.length > 0) {
      const randomIndex = Math.floor(Math.random() * randomStations.length);
      const station = randomStations[randomIndex];
      audioPlayer.playStation(station);
    }
  };

  return <div className="space-y-10 mx-0">
      <div className="relative py-12 px-6 rounded-xl overflow-hidden bg-gradient-to-br from-gowera-purple/10 via-gowera-blue/10 to-gowera-green/10 backdrop-blur-sm border border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.1),transparent_40%),radial-gradient(circle_at_70%_50%,rgba(14,165,233,0.1),transparent_40%)]" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
          <div className="text-left space-y-4 flex-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">
              <Radio size={14} className="mr-2" />
              Radio Premium
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Découvrez notre sélection personnalisée
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Profitez d'une expérience radio sans publicité et accédez à des fonctionnalités exclusives avec notre abonnement Premium.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" className="bg-gradient-to-r from-gowera-purple to-gowera-blue hover:opacity-90">
                Découvrir Premium
              </Button>
              <Button size="lg" variant="outline" onClick={playRandomStation}>
                <Play size={18} className="mr-2" />
                Écouter
              </Button>
            </div>
          </div>
          <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-gowera-purple/20 via-gowera-blue/20 to-gowera-green/20 rounded-2xl transform rotate-3" />
            <div className="absolute inset-0 bg-gradient-to-br from-gowera-purple/20 via-gowera-blue/20 to-gowera-green/20 rounded-2xl transform -rotate-3" />
            <div className="relative h-full rounded-2xl overflow-hidden border border-white/10 backdrop-blur bg-black/5">
              <img 
                src="/placeholder.svg" 
                alt="Radio Premium" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      <section className="mx-0">
        <SectionHeader title="Tendances" description="Les stations les plus écoutées en ce moment" link="/popular" />
        <StationGrid stations={trendingStations?.slice(0, 10) || []} isLoading={loadingTrending} />
      </section>
      
      <section>
        <SectionHeader title="Populaires" description="Les stations les mieux notées" link="/popular" />
        <StationGrid stations={popularStations?.slice(0, 10) || []} isLoading={loadingPopular} />
      </section>
      
      <section>
        <SectionHeader title="Découvrir" description="Essayez quelque chose de nouveau" />
        <StationGrid stations={randomStations || []} isLoading={loadingRandom} />
      </section>
    </div>;
};

export default Home;
