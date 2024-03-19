'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Button from '../../../Components/Button/index';
import useEffectOnce from '../../../Hooks/useEffectOnce';
import sectionThreeImg1 from '@/Assets/_images/about-us-5.webp';
import sectionThreeImg2 from '@/Assets/_images/about-us-6.webp';
import sectionThreeImg3 from '@/Assets/_images/about-us-7.webp';
import ArrowBtnImg from '@/Assets/_images/arrow-circle-right.svg';
import { useRouter } from 'next/navigation';
import '../about-us.scss';

const CarouselSection = (props: any) => {
  const { clx } = props;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<number>(1);

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
    <div className='center-box display-sm-screen'>
      <div className='carousel-wrapper'>
        <div className='text-wrapper'>
          <h2>WHY NIFTIQ</h2>
          <span>We believe in making your journey smoother and hassle-free, giving more freedom to creators and limitless options for
            explorers.
          </span>
        </div>
        <div className='cards-wrapper'>
          <div className={`card-wrapper ${activeTab === 1 ? 'active' : ''}`}>
            <h5>Game Changer</h5>
            <Image src={sectionThreeImg1} alt='doll-image' quality={100} height={1000} width={1000}/>
            <span>The provenance of each digital asset is always available for creators to monetize their work and collectors to buy
              with confidence.
            </span>
          </div>
          <div className={`card-wrapper ${activeTab === 2 ? 'active' : ''}`}>
            <h5>Natively Digital</h5>
            <Image src={sectionThreeImg2} alt='doll-image' quality={100} height={1000} width={1000}/>
            <span>Powered by Kalp blockchain, NiftiQ showcases unique assets in wide digital media, ensuring authenticity and
              scarcity.
            </span>
          </div>
          <div className={`card-wrapper ${activeTab === 3 ? 'active' : ''}`}>
            <h5>Ultimate Protection</h5>
            <Image src={sectionThreeImg3} alt='doll-image' quality={100} height={1000} width={1000}/>
            <span>Every transaction of digital assets is backed by a legal layer ensuring full protection for buyers and
              sellers.
            </span>
          </div>
          <div className="tab-wrapper active">
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
  );
};

export default CarouselSection;
