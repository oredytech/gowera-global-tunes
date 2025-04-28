
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';

export const Footer = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col gap-6 py-6 md:py-8">
        <nav className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            À propos
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Suggérer une radio
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Historique
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Espace pub
          </a>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="w-fit"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="ml-2">{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
          </Button>
        </nav>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GOWERA. Tous droits réservés.</p>
          <p>
            Fièrement conçu par{' '}
            <a 
              href="https://www.oredytech.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              Oredy Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
