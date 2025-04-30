
import React from 'react';
import { ApprovedRadio } from '../services/firebaseService';
import { NewRadioCard } from './NewRadioCard';
import { Loader2 } from 'lucide-react';

interface NewRadiosGridProps {
  radios: ApprovedRadio[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const NewRadiosGrid: React.FC<NewRadiosGridProps> = ({ 
  radios, 
  isLoading = false,
  emptyMessage = "Aucune nouvelle radio pour le moment" 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin mr-2" />
        <span>Chargement des nouvelles radios...</span>
      </div>
    );
  }
  
  if (radios.length === 0) {
    return (
      <div className="flex justify-center items-center py-24 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
      {radios.map((radio) => (
        <NewRadioCard key={radio.id} radio={radio} />
      ))}
    </div>
  );
};
