import React, { useState } from 'react';
import Image from 'next/image';
import { PauseSVG, VideoPlaySVG } from '@/Assets/svg';
import './videoModel.scss';
import ReactPlayer from 'react-player'
import GenericModal from '@/Components/modal';
import VideoPlayer from './VideoPlayer';

const VideoModel: React.FC<{
  videoUrl: string;
  thumbnailUrl: string;
}> = ({ videoUrl, thumbnailUrl }) => {
  const [showVideoModal, toggleVideoModal] = useState<boolean>(false);
  return (
    <div className="video-model">
  
      <div className="video-section">
        <div  className="video-player" onClick={() => toggleVideoModal(!showVideoModal)}><VideoPlaySVG/></div>
      <ReactPlayer 
      className="video-player-wrapper"
      url={videoUrl}
      playing={false}
      loop={false}
      // controls={true}
      light={false}
      />
      </div>
      <GenericModal
            show={showVideoModal}
            onHide={() => toggleVideoModal(!showVideoModal)}
            title="Video Player"
            body={<VideoPlayer videoUrl={videoUrl}/>}
            className=""
            close={true}
            backdrop="static"
          />
      
    </div>
    
  );
};

export default VideoModel;
