
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchStations } from '../services/radioApi';
import { SectionHeader } from '../components/SectionHeader';
import { StationGrid } from '../components/StationGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');
  
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['searchStations', submittedTerm],
    queryFn: () => searchStations(submittedTerm),
    enabled: !!submittedTerm,
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSubmittedTerm(searchTerm.trim());
    }
  };
  
  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Recherche" 
        description="Trouvez des radios par nom, genre, ou pays" 
      />
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Recherchez une radio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">
          <Search size={18} className="mr-2" />
          Rechercher
        </Button>
      </form>
      
      {submittedTerm && (
        <div>
          <h3 className="text-lg font-medium mb-4">
            Résultats pour "{submittedTerm}"
          </h3>
          <StationGrid 
            stations={searchResults || []} 
            isLoading={isLoading}
            emptyMessage={`Aucune station trouvée pour "${submittedTerm}"`}
          />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
