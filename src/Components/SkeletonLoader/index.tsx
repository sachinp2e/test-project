import React from 'react';
import VideoSkeleton from './videoSkeleton';
import AudioSkeleton from './audioSkeleton';
import ImageSkeleton from './imageSkeleton';
import './skeleton.scss';

interface ISkeleton {
  cardType?: 'AUDIO' | 'VIDEO' | 'IMAGE' | 'VIEW';
}

const Skeleton: React.FC<ISkeleton> = ({ cardType }) => {
  switch (cardType) {
    case 'VIDEO':
      return <VideoSkeleton />;
    case 'AUDIO':
      return <AudioSkeleton />;
    default:
      return <ImageSkeleton />;
  }
};

export default Skeleton;