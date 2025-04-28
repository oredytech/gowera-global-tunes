
import React from 'react';
import { Sidebar } from './Sidebar';
import { AudioPlayer } from './AudioPlayer';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { MobileHeader } from './MobileHeader';
import { Footer } from './Footer';

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
        <div className="flex-1 overflow-y-auto">
          <main 
            className={`p-6 ${
              hasPlayer ? 'pb-24 md:pb-20' : 'pb-20 md:pb-16'
            }`}
          >
            <div className="container max-w-7xl px-px">
              {children}
            </div>
          </main>
          <Footer />
        </div>
        <AudioPlayer />
      </div>
    </div>
  );
};

