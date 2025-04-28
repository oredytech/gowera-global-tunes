
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLanguages, getStationsByLanguage } from '../services/radioApi';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const LanguagesPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: languages = [], isLoading: loadingLanguages } = useQuery({
    queryKey: ['languages'],
    queryFn: getLanguages,
  });
  
  const { data: stations, isLoading: loadingStations } = useQuery({
    queryKey: ['stationsByLanguage', selectedLanguage],
    queryFn: () => getStationsByLanguage(selectedLanguage),
    enabled: !!selectedLanguage,
  });
  
  const filteredLanguages = languages
    .filter(lang => lang.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.stationcount - a.stationcount);
  
  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6">
      <div className="border rounded-lg p-4 h-[calc(100vh-8rem)] md:h-auto overflow-hidden">
        <div className="mb-4">
          <Input
            placeholder="Filtrer les langues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          
          {loadingLanguages ? (
            <div className="text-center py-4 text-muted-foreground">Chargement des langues...</div>
          ) : (
            <ScrollArea className="h-[60vh] md:h-[70vh] pr-4">
              <div className="space-y-1">
                {filteredLanguages.map((lang) => (
                  <Button
                    key={lang.name}
                    variant={selectedLanguage === lang.name ? "default" : "ghost"}
                    className="w-full justify-start font-normal"
                    onClick={() => setSelectedLanguage(lang.name)}
                  >
                    <span className="truncate">{lang.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {lang.stationcount}
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
          title={selectedLanguage || "Sélectionnez une langue"} 
          description={selectedLanguage 
            ? `Découvrez les radios en ${selectedLanguage}` 
            : "Choisissez une langue dans la liste pour voir les radios associées"
          } 
        />
        
        {selectedLanguage && (
          <StationGrid 
            stations={stations || []} 
            isLoading={loadingStations}
            emptyMessage={`Aucune station trouvée pour la langue ${selectedLanguage}`}
          />
        )}
      </div>
    </div>
  );
};

export default LanguagesPage;
