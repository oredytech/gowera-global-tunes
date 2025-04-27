
import React from 'react';
import { Home, Radio, Globe, Music, Languages, Heart, Search } from 'lucide-react';

export const getNavItems = (isActive: (path: string) => boolean) => [
  { to: '/', label: 'Accueil', icon: <Home size={20} />, isActive: isActive('/') },
  { to: '/popular', label: 'Populaires', icon: <Radio size={20} />, isActive: isActive('/popular') },
  { to: '/countries', label: 'Pays', icon: <Globe size={20} />, isActive: isActive('/countries') },
  { to: '/genres', label: 'Genres', icon: <Music size={20} />, isActive: isActive('/genres') },
  { to: '/languages', label: 'Langues', icon: <Languages size={20} />, isActive: isActive('/languages') },
  { to: '/search', label: 'Recherche', icon: <Search size={20} />, isActive: isActive('/search') },
  { to: '/favorites', label: 'Favoris', icon: <Heart size={20} />, isActive: isActive('/favorites') },
];
