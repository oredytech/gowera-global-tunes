import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCountries, getStationsByCountry } from '../services/radioApi';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const CountriesPage = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: countries = [], isLoading: loadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  });
  
  const { data: stations, isLoading: loadingStations } = useQuery({
    queryKey: ['stationsByCountry', selectedCountry],
    queryFn: () => getStationsByCountry(selectedCountry),
    enabled: !!selectedCountry,
  });
  
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.stationcount - a.stationcount);
  
  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6">
      <div className="border rounded-lg p-4 h-[calc(100vh-8rem)] md:h-auto overflow-hidden">
        <div className="mb-4">
          <Input
            placeholder="Filtrer les pays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          
          {loadingCountries ? (
            <div className="text-center py-4 text-muted-foreground">Chargement des pays...</div>
          ) : (
            <ScrollArea className="h-[60vh] md:h-[70vh] pr-4">
              <div className="space-y-1">
                {filteredCountries.map((country) => (
                  <Button
                    key={country.name}
                    variant={selectedCountry === country.name ? "default" : "ghost"}
                    className="w-full justify-start font-normal"
                    onClick={() => setSelectedCountry(country.name)}
                  >
                    <span className="truncate">{country.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {country.stationcount}
                    </span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
      
      <div className="overflow-x-hidden">
        <SectionHeader 
          title={selectedCountry || "Sélectionnez un pays"} 
          description={selectedCountry 
            ? `Découvrez les radios de ${selectedCountry}` 
            : "Choisissez un pays dans la liste pour voir ses radios"
          } 
        />
        
        {selectedCountry && (
          <StationGrid 
            stations={stations || []} 
            isLoading={loadingStations}
            emptyMessage={`Aucune station trouvée pour ${selectedCountry}`}
          />
        )}
      </div>
    </div>
  );
};

export default CountriesPage;
