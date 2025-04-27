
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../../contexts/ThemeContext';

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, isActive }) => {
  return (
    <Link to={to}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-secondary'
        }`}
      >
        <div className="w-5 h-5">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
};

interface DesktopNavProps {
  navItems: {
    to: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
  }[];
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ navItems }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold px-4 mb-1 font-poppins text-transparent bg-clip-text bg-gradient-to-r from-gowera-blue to-gowera-purple">
          GOWERA
        </h1>
        <p className="text-xs text-muted-foreground px-4">Les voix du monde</p>
      </div>
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            isActive={item.isActive}
          />
        ))}
      </div>
      <div className="mt-auto pt-4 px-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre'}
        </Button>
      </div>
    </>
  );
};
