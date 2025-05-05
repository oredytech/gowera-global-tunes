
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { RadioStation } from '../services/api';
import { toast } from 'sonner';

interface AudioPlayerContextProps {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playRequestRef = useRef<boolean>(false);

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
        setIsLoading(false);
        playRequestRef.current = false;
      };
      
      audioRef.current.onplaying = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      
      audioRef.current.onpause = () => {
        setIsPlaying(false);
        setIsLoading(false);
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
      
      // Prevent overlapping play requests
      if (playRequestRef.current) {
        console.log('Play request already in progress, ignoring new request');
        return;
      }
      
      // Set flag to prevent concurrent requests
      playRequestRef.current = true;
      
      // Stop current playback
      audioRef.current.pause();
      
      // Set loading state
      setIsLoading(true);
      
      // Set new station
      setCurrentStation(station);
      
      // Set new source
      audioRef.current.src = station.url_resolved;
      
      // Add loading handler
      audioRef.current.oncanplay = () => {
        setIsLoading(false);
      };
      
      // Play and handle errors
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            toast.success(`En lecture: ${station.name}`);
            playRequestRef.current = false;
          })
          .catch((error) => {
            console.error('Playback error:', error);
            toast.error('Impossible de lire cette station');
            setIsPlaying(false);
            setIsLoading(false);
            playRequestRef.current = false;
          });
      }
    } catch (error) {
      console.error('Error playing station:', error);
      toast.error('Erreur lors de la lecture');
      setIsLoading(false);
      playRequestRef.current = false;
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentStation || isLoading) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Prevent overlapping play requests
      if (playRequestRef.current) return;
      
      playRequestRef.current = true;
      setIsLoading(true);
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            playRequestRef.current = false;
          })
          .catch((error) => {
            console.error('Play error:', error);
            toast.error('Impossible de reprendre la lecture');
            setIsLoading(false);
            playRequestRef.current = false;
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
    playRequestRef.current = false;
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentStation,
        isPlaying,
        isLoading,
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
