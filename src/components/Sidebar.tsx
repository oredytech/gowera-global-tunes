
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Radio, Globe, Music, Languages, Heart, Search, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: '/', label: 'Accueil', icon: <Home size={20} />, isActive: isActive('/') },
    { to: '/popular', label: 'Populaires', icon: <Radio size={20} />, isActive: isActive('/popular') },
    { to: '/countries', label: 'Pays', icon: <Globe size={20} />, isActive: isActive('/countries') },
    { to: '/genres', label: 'Genres', icon: <Music size={20} />, isActive: isActive('/genres') },
    { to: '/languages', label: 'Langues', icon: <Languages size={20} />, isActive: isActive('/languages') },
    { to: '/search', label: 'Recherche', icon: <Search size={20} />, isActive: isActive('/search') },
    { to: '/favorites', label: 'Favoris', icon: <Heart size={20} />, isActive: isActive('/favorites') },
  ];

  const renderNavItems = () => (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold px-4 mb-1 font-poppins text-transparent bg-clip-text bg-gradient-to-r from-gowera-blue to-gowera-purple">GOWERA</h1>
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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex md:w-64 flex-col h-screen border-r p-4 ${className}`}>
        {renderNavItems()}
      </aside>
      
      {/* Mobile Sidebar (Sheet/Drawer) */}
      <div className="md:hidden flex items-center p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
            <div className="flex flex-col h-full py-4">
              {renderNavItems()}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="mx-auto">
          <h1 className="text-xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-gowera-blue to-gowera-purple">GOWERA</h1>
        </div>
      </div>
    </>
  );
};
