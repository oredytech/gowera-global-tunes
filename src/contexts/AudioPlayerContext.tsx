
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { RadioStation } from '../services/radioApi';
import { toast } from 'sonner';

interface AudioPlayerContextProps {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  volume: number;
  playStation: (station: RadioStation) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  stopPlayback: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      // Add error handling
      audioRef.current.onerror = (e) => {
        console.error('Audio playback error:', e);
        toast.error('Erreur de lecture. Cette station n\'est peut-être pas disponible.');
        setIsPlaying(false);
      };
    }
    
    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const playStation = (station: RadioStation) => {
    try {
      if (!audioRef.current) return;

      // Stop current playback
      audioRef.current.pause();
      
      // Set new station
      setCurrentStation(station);
      
      // Set new source and play
      audioRef.current.src = station.url_resolved;
      
      // Play and handle errors
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            toast.success(`En lecture: ${station.name}`);
          })
          .catch((error) => {
            console.error('Playback error:', error);
            toast.error('Impossible de lire cette station');
            setIsPlaying(false);
          });
      }
    } catch (error) {
      console.error('Error playing station:', error);
      toast.error('Erreur lors de la lecture');
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentStation) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Play error:', error);
            toast.error('Impossible de reprendre la lecture');
          });
      }
    }
  };

  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = newVolume;
    setVolumeState(newVolume);
  };

  const stopPlayback = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.src = '';
    setIsPlaying(false);
    setCurrentStation(null);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentStation,
        isPlaying,
        volume,
        playStation,
        togglePlayPause,
        setVolume,
        stopPlayback
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextProps => {
  const context = useContext(AudioPlayerContext);
  
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  
  return context;
};
