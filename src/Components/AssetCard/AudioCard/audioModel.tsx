import React, { useState, useEffect, useRef } from 'react';
import { PlaySVG, PauseSVG, VolumeSvg, VolumeMuteSvg } from '@/Assets/svg';
import './audioModel.scss';
import Image from 'next/image';
import Waveform from './WaveForm';

interface AudioModelProps {
  audioUrl: string;
  thumbnailUrl: string | any;
}

const AudioModel: React.FC<AudioModelProps> = ({ audioUrl, thumbnailUrl }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);;
  const [waveFormInstance, setWaveformInstance] = useState<any>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const animationFrameId = requestAnimationFrame(updateProgress);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [isPlaying, currentTime]);
  

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  // const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (progressBarRef.current) {
  //     const rect = progressBarRef.current.getBoundingClientRect();
  //     const offsetX = e.clientX - rect.left;
  //     const progressPercentage = (offsetX / rect.width) * 100;
  //     handleSeek(progressPercentage * duration / 100);
  //   }
  // };

  // const handleProgressDotMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  //   const handleMouseMove = (event: MouseEvent) => {
  //     if (progressBarRef.current) {
  //       const rect = progressBarRef.current.getBoundingClientRect();
  //       const offsetX = event.clientX - rect.left;
  //       const progressPercentage = Math.min(Math.max(offsetX / rect.width, 0), 1) * 100;
  //       handleSeek(progressPercentage * duration / 100);
  //     }
  //   };

  //   const handleMouseUp = () => {
  //     document.removeEventListener('mousemove', handleMouseMove);
  //     document.removeEventListener('mouseup', handleMouseUp);
  //   };

  //   document.addEventListener('mousemove', handleMouseMove);
  //   document.addEventListener('mouseup', handleMouseUp);
  // };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (eventOrTime: React.MouseEvent<HTMLDivElement, MouseEvent> | number) => {
    let seekTime: number;
    if (typeof eventOrTime === 'number') {
      seekTime = eventOrTime;
    } else {
      const event = eventOrTime as React.MouseEvent<HTMLDivElement, MouseEvent>;
      if (audioRef.current && progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const progressPercentage = (offsetX / rect.width) * 100;
        seekTime = (progressPercentage / 100) * duration;
      } else {
        return;
      }
    }
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
    setCurrentTime(seekTime);
  };

  const updateProgress = () => {
    if (audioRef.current && duration > 0) {
      const currentTime = audioRef.current.currentTime;
      const currentProgress = (currentTime / duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(currentTime);

      if (currentProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        setProgress(0);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  return (
    <div className="audio-model">
      <div className="thumbnail-container">
        <Image
          src={thumbnailUrl}
          alt="Thumbnail"
          width={500}
          height={500}
        />
      </div>
      <div className="player-controls">
        {/* <div className="progress-bar" ref={progressBarRef} onClick={handleSeekClick}> */}
          
            {/* <div className="progress" style={{ width: `${progress}%` }} /> */}
            <Waveform
                  setWaveformInstance={setWaveformInstance}
                  audioUrl={audioUrl}
                  
                
                />
            {/* <div className="progress-dot" style={{ left: `${progress}%` }} onMouseDown={handleProgressDotMouseDown} /> */}
          
        {/* </div> */}

        <div className='bottom-side-player'>
          <div className="playback-controls">
            <span className="time">{formatTime(currentTime)} </span>
            <span className='audio-svg' onClick={toggleMute}>
              {isMuted ? <VolumeMuteSvg /> : <VolumeSvg />}
            </span>
            <audio ref={audioRef} src={audioUrl} />
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
            {isPlaying ? (
              <span className="control pause" onClick={handlePlayPause}>
                <PauseSVG />
              </span>
            ) : (
              <span className="control play" onClick={handlePlayPause}>
                <PlaySVG />
              </span>
            )}
            <span className='time'> {formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioModel;
