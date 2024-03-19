import React, { useState, useEffect, useRef } from 'react';
import { PlaySVG, PauseSVG, VolumeSvg, VolumeMuteSvg } from '@/Assets/svg';
import './audioModel.scss';
import Image from 'next/image';
import Waveform from './WaveForm';
import useEffectOnce from '../../../Hooks/useEffectOnce';

interface AudioModelProps {
  audioUrl: string;
  thumbnailUrl: string | any;
}

const AudioModel: React.FC<AudioModelProps> = ({ audioUrl, thumbnailUrl }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<any>(0);
  const [volume, setVolume] = useState<number>(0.2);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [waveFormInstance, setWaveformInstance] = useState<any>(null);
  const [duration, setDuration] = useState<any>(0);

  const handlePlay = () => {
      waveFormInstance.play();
      waveFormInstance.on('audioprocess', onTimeUpdate);
      setIsPlaying(true);
  };

  const handlePause = () => {
      waveFormInstance.pause();
      setIsPlaying(false);
  };

  useEffect(() => {
    if(currentTime.toFixed() === duration.toFixed()) {
      setIsPlaying(false)
    }
  }, [duration, currentTime])

  useEffectOnce(() => {
    if (waveFormInstance) {
      waveFormInstance.on('audioprocess', onTimeUpdate);
    }
    return () => {
      if (waveFormInstance) {
        waveFormInstance.un('audioprocess', onTimeUpdate);
      }
    };
  });

  const onTimeUpdate = () => {
    if (waveFormInstance.isPlaying()) {
      var currentTime = waveFormInstance.getCurrentTime(),
        totalTime = waveFormInstance.getDuration();
      setDuration(totalTime);
      setCurrentTime(currentTime)
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(prev => !prev);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {

      audioRef.current.volume = newVolume;
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
        <Waveform
          setWaveformInstance={setWaveformInstance}
          audioUrl={audioUrl}
        />
        <div className='bottom-side-player'>
          <div className="playback-controls">
            <span className="time">{formatTime(currentTime)}</span>
            <span className='audio-svg' onClick={toggleMute}>
              {isMuted ? <VolumeMuteSvg /> : <VolumeSvg />}
            </span>
            <audio ref={audioRef} src={audioUrl}/>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
            {isPlaying ? (
              <span className="control pause" onClick={handlePause}>
                <PauseSVG />
              </span>
            ) : (
              <span className="control play" onClick={handlePlay}>
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
