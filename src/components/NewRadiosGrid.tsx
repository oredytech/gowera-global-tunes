
import React from 'react';
import { ApprovedRadio } from '../services/firebase';
import { NewRadioCard } from './NewRadioCard';
import { Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    const indexUrl = isFirebaseIndexError 
      ? errorMessage.match(/https:\/\/console\.firebase\.google\.com[^\s"')]+/)?.[0] 
      : null;
    
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur lors du chargement des nouvelles radios</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>
            {isFirebaseIndexError 
              ? "Configuration Firebase: Un index est requis pour afficher les nouvelles radios." 
              : "Impossible de charger les nouvelles radios. Veuillez réessayer plus tard."}
          </p>
          {indexUrl && (
            <div>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2"
                onClick={() => window.open(indexUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Créer l'index requis
              </Button>
              <p className="text-xs mt-2">
                Après avoir créé l'index, veuillez rafraîchir la page pour voir les nouvelles radios.
              </p>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (radios.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-12 text-muted-foreground">
        <p className="mb-4">{emptyMessage}</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/suggest-radio">Suggérer une radio</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {radios.map((radio) => (
          <NewRadioCard key={radio.id} radio={radio} />
        ))}
      </div>
      {radios.length >= 6 && (
        <div className="flex justify-center pt-2">
          <Button asChild variant="outline">
            <Link to="/new-radios">
              Voir toutes les nouvelles radios
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
