
import React from 'react';
import { useLocation } from 'react-router-dom';
import { MobileNav } from './navigation/MobileNav';
import { DesktopNav } from './navigation/DesktopNav';
import { getNavItems } from './navigation/navItems';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navItems = getNavItems(isActive);

  return (
    <>
      <aside className={`hidden md:flex md:w-64 flex-col h-screen border-r p-4 ${className}`}>
        <DesktopNav navItems={navItems} />
      </aside>
      <MobileNav navItems={navItems} />
    </>
  );
};
