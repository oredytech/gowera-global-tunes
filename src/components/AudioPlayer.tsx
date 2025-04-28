import React from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { Play, Pause, Volume2, VolumeX, Loader } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import placeholderImage from '/placeholder.svg';
export const AudioPlayer: React.FC = () => {
  const {
    currentStation,
    isPlaying,
    volume,
    togglePlayPause,
    setVolume,
    isLoading
  } = useAudioPlayer();
  if (!currentStation) return null;
  const stationImage = currentStation.favicon && currentStation.favicon !== '' ? currentStation.favicon : placeholderImage;
  return <div className="audio-player fixed bottom-0 left-0 right-0 flex items-center bg-background/80 backdrop-blur-md border-t p-2 px-4 md:mb-0 mb-16">
      <div className="flex items-center justify-between w-full gap-4 px-[20px]">
        <img src={stationImage} alt={currentStation.name} className="h-12 w-12 object-cover rounded-md" onError={e => {
        (e.target as HTMLImageElement).src = placeholderImage;
      }} />
        
        <div className="flex-grow max-w-[50%]">
          <h3 className="text-sm font-medium truncate">{currentStation.name}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {currentStation.country || 'Unknown'} • {currentStation.tags?.split(',')[0] || 'Radio'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={togglePlayPause} className="rounded-full" disabled={isLoading}>
            {isLoading ? <Loader className="animate-spin" size={20} /> : isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>

          <div className="hidden sm:flex items-center gap-2 w-32">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setVolume(volume === 0 ? 0.7 : 0)}>
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
            <Slider value={[volume * 100]} min={0} max={100} step={1} onValueChange={value => setVolume(value[0] / 100)} className="w-24" />
          </div>
        </div>
      </div>
    </div>;
};