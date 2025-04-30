
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Radio, Megaphone, BarChart, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavItem = ({ to, label, icon, isActive }: { 
  to: string; 
  label: string; 
  icon: React.ReactNode; 
  isActive: boolean 
}) => (
  <Link to={to}>
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary"
      )}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  </Link>
);

export const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: '/admin', label: 'Tableau de bord', icon: <LayoutDashboard size={20} />, isActive: isActive('/admin') },
    { to: '/admin/radios', label: 'Gérer les radios', icon: <Radio size={20} />, isActive: isActive('/admin/radios') },
    { to: '/admin/advertisements', label: 'Publicités', icon: <Megaphone size={20} />, isActive: isActive('/admin/advertisements') },
    { to: '/admin/statistics', label: 'Statistiques', icon: <BarChart size={20} />, isActive: isActive('/admin/statistics') },
    { to: '/admin/users', label: 'Utilisateurs', icon: <Users size={20} />, isActive: isActive('/admin/users') },
    { to: '/admin/settings', label: 'Paramètres', icon: <Settings size={20} />, isActive: isActive('/admin/settings') },
  ];

  return (
    <aside className="w-64 border-r bg-background h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">GOWERA Admin</h1>
        <p className="text-xs text-muted-foreground">Tableau de bord d'administration</p>
      </div>
      <nav className="space-y-1 px-2 flex-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            isActive={item.isActive}
          />
        ))}
      </nav>
      <div className="p-4 border-t">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          Retour au site principal
        </Link>
      </div>
    </aside>
  );
};
