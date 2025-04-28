
import React from 'react';
import { useLocation } from 'react-router-dom';
import { MobileNav } from './navigation/MobileNav';
import { DesktopNav } from './navigation/DesktopNav';
import { getNavItems } from './navigation/navItems';
import { SidebarProvider, Sidebar as ShadcnSidebar } from './ui/sidebar';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navItems = getNavItems(isActive);

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <ShadcnSidebar className={className}>
          <DesktopNav navItems={navItems} />
        </ShadcnSidebar>
        <MobileNav navItems={navItems} />
      </div>
    </SidebarProvider>
  );
};
