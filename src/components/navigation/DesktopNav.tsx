
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, isActive }) => {
  const { state } = useSidebar();
  
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
        {state !== 'collapsed' && (
          <span className="text-sm font-medium">{label}</span>
        )}
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
  const { toggleSidebar, state } = useSidebar();

  return (
    <>
      <div className="mb-8 flex items-center justify-between px-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-gowera-blue to-gowera-purple">
            {state !== 'collapsed' ? 'GOWERA' : 'G'}
          </h1>
          {state !== 'collapsed' && (
            <p className="text-xs text-muted-foreground">Les voix du monde</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleSidebar}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${
            state === 'collapsed' ? 'rotate-180' : ''
          }`} />
        </Button>
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
          {state !== 'collapsed' ? (
            theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre'
          ) : (
            theme === 'dark' ? '☀️' : '🌙'
          )}
        </Button>
      </div>
    </>
  );
};
