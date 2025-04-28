
import React from 'react';
import { RadioStation } from '../services/radioApi';
import { StationCard } from './StationCard';
import { Loader2 } from 'lucide-react';

interface StationGridProps {
  stations: RadioStation[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const StationGrid: React.FC<StationGridProps> = ({ 
  stations, 
  isLoading = false,
  emptyMessage = "Aucune station trouvée" 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin mr-2" />
        <span>Chargement des stations...</span>
      </div>
    );
  }
  
  if (stations.length === 0) {
    return (
      <div className="flex justify-center items-center py-24 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
      {stations.map((station) => (
        <StationCard key={station.stationuuid} station={station} />
      ))}
    </div>
  );
};
