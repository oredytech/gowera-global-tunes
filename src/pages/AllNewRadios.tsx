import { useQuery } from '@tanstack/react-query';
import { getNewlyApprovedRadios } from '../services/firebase';
import { NewRadiosGrid } from '@/components/NewRadiosGrid';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AllNewRadios() {
  const { data: newRadios = [], isLoading, error } = useQuery({
    queryKey: ['allNewRadios'],
    queryFn: () => getNewlyApprovedRadios(100), // Charger jusqu'à 100 radios
  });

  return (
    <>
      <Helmet>
        <title>Toutes les nouvelles radios | GOWERA</title>
        <meta name="description" content="Découvrez toutes les radios récemment ajoutées sur GOWERA" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="icon">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Nouvelles radios
            </h1>
            <p className="text-muted-foreground mt-1">
              Découvrez toutes les radios récemment ajoutées
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <NewRadiosGrid 
              radios={newRadios}
              isLoading={isLoading}
              error={error}
              emptyMessage="Aucune nouvelle radio disponible pour le moment"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
