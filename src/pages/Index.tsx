
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AudioWaveform } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md p-4">
        <div className="flex items-center justify-center gap-2">
          <AudioWaveform className="w-12 h-12 text-gowera-blue" />
          <h1 className="text-4xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-gowera-blue to-gowera-purple">
            GOWERA
          </h1>
        </div>
        <p className="text-xl text-muted-foreground">Les voix du monde</p>
        <p className="text-base text-muted-foreground">
          Découvrez une collection mondiale de stations radio, organisées par pays, genre et langue.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link to="/popular">Commencer l'écoute</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
