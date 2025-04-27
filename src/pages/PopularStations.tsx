
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPopularStations, getTrendingStations } from '../services/radioApi';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';

const PopularStations = () => {
  const { data: popularStations, isLoading: loadingPopular } = useQuery({
    queryKey: ['popularStations'],
    queryFn: () => getPopularStations(),
  });
  
  const { data: trendingStations, isLoading: loadingTrending } = useQuery({
    queryKey: ['trendingStations'],
    queryFn: () => getTrendingStations(),
  });
  
  return (
    <div className="space-y-10">
      <section>
        <SectionHeader 
          title="Tendances" 
          description="Les stations les plus écoutées en ce moment" 
        />
        <StationGrid 
          stations={trendingStations || []} 
          isLoading={loadingTrending} 
        />
      </section>
      
      <section>
        <SectionHeader 
          title="Populaires" 
          description="Les stations les mieux notées" 
        />
        <StationGrid 
          stations={popularStations || []} 
          isLoading={loadingPopular} 
        />
      </section>
    </div>
  );
};

export default PopularStations;
