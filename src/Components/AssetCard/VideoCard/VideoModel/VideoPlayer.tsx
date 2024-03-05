import React, { useState } from 'react';
import Image from 'next/image';
import { PauseSVG, VideoPlaySVG,CloseModalIcon } from '@/Assets/svg';
import './videoModel.scss';
import ReactPlayer from 'react-player'

const VideoPlayer: React.FC<{
  videoUrl: string;
}> = ({ videoUrl }) => {



  return (
    // <div className="video-player-model">
  
      <div className="video-player-section">
      <ReactPlayer url={videoUrl}
      playing={false}
      loop={false}
      controls={true}
      light={false}
      />

  {/* <ReactPlayer
  url={videoUrl}
  playing={true}
  controls={true}
  light={true}
  config={{
    youtube: {
      playerVars: { showinfo: 1 }
      
    }
  }}
/> */}
    </div>
    
  );
};

export default VideoPlayer;
