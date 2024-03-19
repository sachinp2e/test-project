'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Slider from './Slider/index';
import Button from '../../../Components/Button/index';
import useEffectOnce from '../../../Hooks/useEffectOnce';
import ArrowBtnImg from '../../../Assets/_images/arrow-circle-right.svg';
import './hero-section.scss';

interface IHeroSectionType {
}

const HeroSection: React.FC<IHeroSectionType> = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const router = useRouter();

  const handleTabs = (tabNumber: any) => {
    setActiveTab(tabNumber);
  };

  // change tabs after every 2 seconds
  const initiateAutoScroll = () => {
    setInterval(() => {
      setActiveTab(prev => {
        if (prev === 3) {
          return 1;
        }
        return prev + 1;
      });
    }, 2000);
  };

  useEffectOnce(() => {
    initiateAutoScroll();
  });

  return (
    <div className="hero-section">
      <div className="container-fluid">
        <div className="content-wrapper">
          <div className="details">
            <div
              className={`tabcontent ${activeTab === 1 ? 'active' : ''}`}
            >
              <div className="d-flex flex-column">
                <div className="title">EXPLORE UNIQUE ASSETS</div>
                <p className="discription">
                     With NiftiQ, you have the opportunity to have control of your work, and connect with your biggest supporters.
                </p>
              </div>
            </div>
            <div
              className={`tabcontent ${activeTab === 2 ? 'active' : ''}`}
            >
              <div className="d-flex flex-column">
                <div className="title">SECURE. POWERFUL. PROFITABLE</div>
                <p className="discription" style={{textAlign:"center"}}>
                    We bridge the gap between creators, collectors, and enthusiasts by offering an ultimate digital asset marketplace powered by DLT.
                </p>
              </div>
            </div>
            <div
              className={`tabcontent ${activeTab === 3 ? 'active' : ''}`}
            >
              <div className="d-flex flex-column">
                <div className="title">EMPOWER YOUR CREATIVITY</div>
                <p className="discription">
                  As a creator, you can curate, exchange, and monetize your digital collectibles.
                </p>
              </div>
            </div>
            <Button
              className="explore-assets-btn"
              element={(
                <div className="d-flex align-items-center">
                  <span className="me-2">Explore Assets</span>
                  <Image src={ArrowBtnImg} alt="arrow" />
                </div>
              )}
              onClick={() => router.push('/explore/assets')}
              isFilled
              isGradient
            />
          </div>
          <div className="tab-wrapper">
            <div className="tab">
              <div
                className={`tablinks ${activeTab === 1 ? 'active' : ''}`}
                onClick={() => handleTabs(1)}
              />
              <div
                className={`tablinks ${activeTab === 2 ? 'active' : ''}`}
                onClick={() => handleTabs(2)}
              />
              <div
                className={`tablinks ${activeTab === 3 ? 'active' : ''}`}
                onClick={() => handleTabs(3)}
              />
            </div>
          </div>
        </div>
      </div>
      <Slider />
    </div>
  );
};

export default HeroSection;
