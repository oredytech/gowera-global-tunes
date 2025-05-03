
import React from 'react';
import { ApprovedRadio } from '../services/firebase';
import { NewRadioCard } from './NewRadioCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewRadiosGridProps {
  radios: ApprovedRadio[];
  isLoading?: boolean;
  error?: unknown;
  emptyMessage?: string;
}

export const NewRadiosGrid: React.FC<NewRadiosGridProps> = ({ 
  radios, 
  isLoading = false,
  error = null,
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
  
  if (error) {
    // Vérification si l'erreur est liée à un index Firebase manquant
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isFirebaseIndexError = errorMessage.includes('requires an index');
    
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {isFirebaseIndexError 
            ? "Erreur de configuration Firebase: Un index est requis pour afficher les nouvelles radios. Veuillez consulter la console d'erreurs pour obtenir le lien de création de l'index." 
            : "Impossible de charger les nouvelles radios. Veuillez réessayer plus tard."}
        </AlertDescription>
      </Alert>
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
