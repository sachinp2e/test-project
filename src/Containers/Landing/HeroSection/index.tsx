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
                <span className="sub-title">Explore the world of</span>
                <div className="title">CREATIVE AND UNIQUE ASSETS</div>
              </div>
            </div>
            <div
              className={`tabcontent ${activeTab === 2 ? 'active' : ''}`}
            >
              <div className="d-flex flex-column">
                <span className="sub-title">
                  get to know the easy process of
                </span>
                <div className="title">creating & selling assets</div>
              </div>
            </div>
            <div
              className={`tabcontent ${activeTab === 3 ? 'active' : ''}`}
            >
              <div className="d-flex flex-column">
                <span className="sub-title">ready to</span>
                <div className="title">explore unique assets?</div>
              </div>
            </div>
            <p className="discription">
              Lorem ipsum dolor sit amet consectetur. Egestas lorem diam vel
              nulla laoreet. At risus pharetra et pellentesque non adipiscing ut
              mus.
            </p>
            <p className="discription">
              Donec phasellus placerat cras id amet. Nunc potenti ultrices
              volutpat nisl ullamcorper.
            </p>
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
