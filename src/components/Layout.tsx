
import React from 'react';
import { Sidebar } from './Sidebar';
import { AudioPlayer } from './AudioPlayer';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentStation } = useAudioPlayer();
  const hasPlayer = !!currentStation;
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`flex-1 overflow-auto p-6 ${hasPlayer ? 'pb-20' : ''}`}>
        <div className="container max-w-7xl">
          {children}
        </div>
      </main>
      <AudioPlayer />
    </div>
  );
};
