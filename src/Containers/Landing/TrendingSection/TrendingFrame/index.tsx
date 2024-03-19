'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import TrendingFrameIcon1 from '../../../../Assets/_images/TrendingFrameIcon1.svg'
import TrendingFrameIcon2 from '../../../../Assets/_images/TrendingFrameIcon2.svg'
import TrendingFrameIcon3 from '../../../../Assets/_images/TrendingFrameIcon3.svg'
import TrendingFrameIcon4 from '../../../../Assets/_images/TrendingFrameIcon4.svg'
import TrendingFrameIcon5 from '../../../../Assets/_images/TrendingFrameIcon5.svg'
import TrendingFrameIcon6 from '../../../../Assets/_images/TrendingFrameIcon6.svg'
import './trending-frame.scss'
import useEffectOnce from '../../../../Hooks/useEffectOnce';

interface ITrendingFrameType { }

const tabsData = [
  {
    id: 1,
    text: 'DLT POWERED',
    logo: TrendingFrameIcon1,
    background:
      'linear-gradient(114deg, #FFCB14 0%, #FE9417 26.56%, #FF2DF7 79.86%, #D150FF 100%)',
  },
  {
    id: 2,
    text: 'LEGAL LAYER',
    logo: TrendingFrameIcon3,
    background:
      'linear-gradient(114deg, #1D0757 0%, #2A7666 19.97%, #669F72 56.94%, #BDC659 78.82%, #D4DEA2 100%)',
  },
  {
    id: 3,
    text: 'KYC AUTHENTICATION',
    logo: TrendingFrameIcon2,
    background:
      'linear-gradient(211deg, #FFCBA0 -10.18%, #DD5789 34.79%, #9B5BE6 82.83%)'
  },
  {
    id: 4,
    text: 'FIAT SUPPORT',
    logo: TrendingFrameIcon4,
    background:
      'linear-gradient(315deg, #21BDB8 13.24%, #280684 100%)',
    card1:
      'linear-gradient(114deg, #FFCB14 0%, #FE9417 26.56%, #FF2DF7 79.86%, #D150FF 100%)',
  },
  {
    id: 5,
    text: 'ASSET VERIFICATION',
    logo: TrendingFrameIcon5,
    background:
      'linear-gradient(114deg, #36DFF2 0%, #6E73F4 19.97%, #7A57F4 39.01%, #DC6CEC 80.13%, #E07BEA 100%)',
  },
  {
    id: 6,
    text: 'WIDE MEDIA SUPPORT',
    logo: TrendingFrameIcon6,
    background:
      'linear-gradient(132deg, #D24074 -0.67%, #6518B4 73.4%, #521392 102.44%)',
  },
];

const TrendingFrame: React.FC<ITrendingFrameType> = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const handleTabs = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  // change tabs after every 2 seconds
  const initiateAutoScroll = () => {
    setInterval(() => {
      setActiveTab(prev => {
        if (prev === tabsData.length) {
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
    <div className="frame-main-container">
      <div className="reliable-details">
        <div className="details-inner-wrapper">
          <div className="heading">YOUR ASSETS, UNLIMITED POTENTIAL</div>
          <div className='sub-heading'>Indulge in a celebration of artistic legacy.</div>
          <p className="description">
            With blockchain-stored certificates of
            authenticity and royalties, artists and buyers alike
            enjoy unmatched trust and equity in every
            transaction.
          </p>
        </div>
        <div className="img-wrapper">
          <div className="wrapper">
            <div className="card-1" />
            <div className="card-2" />
            {tabsData.map((tab,index) => (
              <div key={index} className={`main-card ${ activeTab === tab.id ? 'selected' : '' }`} style={{ background: tab?.background }} >
                <div className="card-logo">
                  <Image src={tab.logo} alt="card-logo" />
                </div>
                <div className="card-text">{tab.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="carousel">
        <div className="tab">
          {tabsData.map((tab) => (
            <div
              key={tab.id}
              className={`tablinks ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabs(tab.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingFrame;
