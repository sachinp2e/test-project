import React from 'react';
import './style.scss';
import { CrossIcon, Discord, FacebookIcon, Instagram, TwitterIcon } from '@/Assets/svg';

const ShareOverlay: React.FC= () => {
  return (
    <div className="d-flex align-items-center gap-2 share-icons-wrapper">
      <div className='cross-btn d-flex justify-content-center align-items-center'>
        <CrossIcon />
      </div>
      <FacebookIcon />
      <TwitterIcon height={24} width={24} />
      <Instagram height={24} width={24} />
      <Discord height={24} width={24} />
    </div>
  );
};

export default ShareOverlay;
