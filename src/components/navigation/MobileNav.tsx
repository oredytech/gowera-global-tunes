
import React from 'react';
import { Link } from 'react-router-dom';

interface MobileNavProps {
  navItems: {
    to: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    badge?: React.ReactNode;
  }[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ navItems }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t flex justify-around items-center px-2 py-1 z-50 h-16">
      {navItems.map((item) => (
        <Link 
          key={item.to} 
          to={item.to} 
          className={`flex flex-col items-center p-1 rounded-lg relative ${
            item.isActive 
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="w-5 h-5 relative">
            {item.icon}
            {item.badge && (
              <div className="absolute -top-1 -right-2">
                {item.badge}
              </div>
            )}
          </div>
          <span className="text-[10px] mt-0.5 truncate max-w-[60px]">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};
