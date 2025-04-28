import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPopularStations, getTrendingStations, getRandomStations } from '../services/radioApi';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';
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
