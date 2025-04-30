
import React from 'react';
import { Menu, AudioWaveform, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { UserProfileButton } from './auth/UserProfileButton';

export const MobileHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <AudioWaveform className="w-6 h-6 text-gowera-blue" />
        <h1 className="text-2xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-gowera-blue to-gowera-purple">
          GOWERA
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <UserProfileButton />
        
        <Button variant="ghost" size="icon" asChild>
          <Link to="/search">
            <Search className="h-5 w-5" />
            <span className="sr-only">Recherche</span>
          </Link>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/about">À propos</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/contact">Contact</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/suggest-radio">Suggérer une radio</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/history">Historique</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/advertising">Espace pub</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
