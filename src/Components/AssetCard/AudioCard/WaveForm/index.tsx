import React, { useEffect, useRef } from 'react';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';

interface WaveformProps {
  audioUrl: string;
  setWaveformInstance: (instance: WaveSurfer) => void;
}

const Waveform: React.FC<WaveformProps> = ({ audioUrl, setWaveformInstance }) => {
  const wavesurferRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options: WaveSurferOptions = {
      container: wavesurferRef.current!,
      waveColor: 'white',
      progressColor: '#383351',
      barRadius:3,
      barWidth: 3,
      height:100
    };

    const wavesurfer = WaveSurfer.create(options);

    wavesurfer.load(audioUrl);

    wavesurfer.on('ready', () => {
      setWaveformInstance(wavesurfer);
    });

    return () => wavesurfer.destroy();
  }, [audioUrl, setWaveformInstance]);

  return <div ref={wavesurferRef} style={{ width: '100%', maxWidth: '500px' }}></div>

};

export default Waveform;
