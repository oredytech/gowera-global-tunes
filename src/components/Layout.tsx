
import React from 'react';
import { Sidebar } from './Sidebar';
import { AudioPlayer } from './AudioPlayer';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { MobileHeader } from './MobileHeader';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentStation } = useAudioPlayer();
  const hasPlayer = !!currentStation;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader />
        <main 
          className={`flex-1 overflow-y-auto p-6 ${
            hasPlayer ? 'pb-28 md:pb-20' : 'pb-24 md:pb-6'
          }`}
        >
          <div className="container max-w-7xl px-px">
            {children}
          </div>
        </main>
        <AudioPlayer />
      </div>
    </div>
  );
};
