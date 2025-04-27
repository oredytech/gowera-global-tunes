
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTags, getStationsByTag } from '../services/radioApi';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const GenresPage = () => {
  const [selectedTag, setSelectedTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: tags = [], isLoading: loadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });
  
  const { data: stations, isLoading: loadingStations } = useQuery({
    queryKey: ['stationsByTag', selectedTag],
    queryFn: () => getStationsByTag(selectedTag),
    enabled: !!selectedTag,
  });
  
  const filteredTags = tags
    .filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.stationcount - a.stationcount)
    .slice(0, 100); // Limit to top 100 to prevent overwhelming the UI
  
  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6">
      <div className="border rounded-lg p-4">
        <div className="mb-4">
          <Input
            placeholder="Filtrer les genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          
          {loadingTags ? (
            <div className="text-center py-4 text-muted-foreground">Chargement des genres...</div>
          ) : (
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-1">
                {filteredTags.map((tag) => (
                  <Button
                    key={tag.name}
                    variant={selectedTag === tag.name ? "default" : "ghost"}
                    className="w-full justify-start font-normal"
                    onClick={() => setSelectedTag(tag.name)}
                  >
                    <span className="truncate">{tag.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {tag.stationcount}
                    </span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
      
      <div>
        <SectionHeader 
          title={selectedTag || "Sélectionnez un genre"} 
          description={selectedTag 
            ? `Découvrez les radios de genre ${selectedTag}` 
            : "Choisissez un genre dans la liste pour voir les radios associées"
          } 
        />
        
        {selectedTag && (
          <StationGrid 
            stations={stations || []} 
            isLoading={loadingStations}
            emptyMessage={`Aucune station trouvée pour le genre ${selectedTag}`}
          />
        )}
      </div>
    </div>
  );
};

export default GenresPage;
