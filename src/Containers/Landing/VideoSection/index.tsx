import React from 'react';
import { VideoPlaySVG } from '../../../Assets/svg';
import './video-section.scss';

interface IVideoSectionType {
}

const VideoSection: React.FC<IVideoSectionType> = () => {
  return (
    <div className="main-video-section-wrapper">
      <div>
        <div className="video-section-header">
          how it works
        </div>
        <div className="sub-video-description">
          Check out the video to make your journey even more easier.
        </div>
        <div className="video-card-wrapper">
          <VideoPlaySVG />
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
