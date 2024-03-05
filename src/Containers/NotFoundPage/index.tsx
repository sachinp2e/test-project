'use client'
import Link from 'next/link';
import './styles/main.scss';
import React from 'react';
import astronaut from '@/Assets/_images/astronaut.svg';
import overlayStars from '@/Assets/_images/overlay_stars.svg';
import Image from 'next/image';

export function NotFoundPage() {
  const navigateToHomePage = ()=>{
    window.location.href = '/'
  }
  return (
    <>
      <main
        style={{
          backgroundImage: `url(${overlayStars.src})`,
          width: '100%',
          height: '100%',
        }}
      >
        <div className="message">
          <strong>404</strong>
          <p className="title">LOOKS LIKE YOU ARE LOST IN <del>SPACE</del> NiftiQ</p>
          <p className="message-text">
            The page you are looking for might be removed or is temporarily
            unavailable 💀☠️

          </p>
          <button onClick={navigateToHomePage} className="button">GO BACK HOME</button>
        </div>
      </main>

      <div className="box-astronaut">
        <Image width={300} height={300} src={astronaut} alt="Astronaut" />
      </div>
    </>
  );
}

export default NotFoundPage;
