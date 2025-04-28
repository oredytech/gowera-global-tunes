
import React from 'react';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';

export const MobileHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-gowera-blue to-gowera-purple">
        GOWERA
      </h1>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            À propos
          </DropdownMenuItem>
          <DropdownMenuItem>
            Contact
          </DropdownMenuItem>
          <DropdownMenuItem>
            Suggérer une radio
          </DropdownMenuItem>
          <DropdownMenuItem>
            Historique
          </DropdownMenuItem>
          <DropdownMenuItem>
            Espace pub
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
