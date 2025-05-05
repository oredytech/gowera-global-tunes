
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPopularStations, getTrendingStations, getRandomStations } from '../services/api';
import { getNewlyApprovedRadios } from '../services/firebase';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';
import { NewRadiosGrid } from '../components/NewRadiosGrid';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    isLoading: loadingNewRadios,
    error: newRadiosError
  } = useQuery({
    queryKey: ['newRadios'],
    queryFn: () => getNewlyApprovedRadios(6)
  });

  // Ajouter un effet pour logger les erreurs liées aux nouvelles radios
  useEffect(() => {
    if (newRadiosError) {
      console.error("Erreur lors du chargement des nouvelles radios:", newRadiosError);
      
      // Si l'erreur contient un lien vers la création d'un index Firebase
      if (newRadiosError instanceof Error && newRadiosError.message.includes('https://console.firebase.google.com')) {
        console.error("Pour résoudre cette erreur, veuillez créer l'index en suivant ce lien dans le message d'erreur ci-dessus");
      }
    }
  }, [newRadiosError]);

  // Ajouter un effet pour vérifier si les nouvelles radios sont chargées
  useEffect(() => {
    if (newRadios) {
      console.log("Nouvelles radios chargées:", newRadios.length, newRadios);
    }
  }, [newRadios]);

  const playRandomStation = () => {
    if (randomStations && randomStations.length > 0) {
      const randomIndex = Math.floor(Math.random() * randomStations.length);
      const station = randomStations[randomIndex];
      audioPlayer.playStation(station);
    }
  };

  return <div className="space-y-10 mx-0">
      <section className="mx-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <SectionHeader 
            title="Nouvelles radios" 
            description="Les stations récemment ajoutées à GOWERA" 
          />
          <Button variant="outline" size="sm" asChild className="mt-2 sm:mt-0">
            <Link to="/suggest-radio">Suggérer une radio</Link>
          </Button>
        </div>
        <NewRadiosGrid 
          radios={newRadios || []} 
          isLoading={loadingNewRadios} 
          error={newRadiosError}
          emptyMessage="Aucune nouvelle radio n'a été ajoutée récemment. Soyez le premier à en suggérer une !"
        />
      </section>
      
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
