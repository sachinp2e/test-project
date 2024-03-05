'use client';
import React, { useState, useEffect } from 'react';
import './scrollToTop.scss';
import scrollTOTop from '@/Assets/_images/scrollToTop.svg';
import Image from 'next/image';
const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setIsVisible(scrollY > 100); // Adjust the threshold as needed
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      className={`scroll-to-top-button ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
    >
      <Image src={scrollTOTop} alt="" />
    </button>
  );
};

export default ScrollToTopButton;
