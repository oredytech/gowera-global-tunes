
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Radio, Globe, Music, Languages, Heart, Search } from 'lucide-react';

interface MobileNavProps {
  navItems: {
    to: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
  }[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ navItems }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t flex justify-around items-center px-2 py-2 z-50 h-16">
      {navItems.map((item) => (
        <Link 
          key={item.to} 
          to={item.to} 
          className={`flex flex-col items-center p-2 rounded-lg ${
            item.isActive 
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="w-6 h-6">{item.icon}</div>
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};
