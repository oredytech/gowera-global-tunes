
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '../../contexts/ThemeContext';
import { AudioWaveform } from 'lucide-react';

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  badge?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, isActive, badge }) => {
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
        {badge}
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
    badge?: React.ReactNode;
  }[];
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ navItems }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-2 px-4 mb-1">
          <AudioWaveform className="w-8 h-8 text-gowera-blue" />
          <h1 className="text-2xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-gowera-blue to-gowera-purple">
            GOWERA
          </h1>
        </div>
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
            badge={item.badge}
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
