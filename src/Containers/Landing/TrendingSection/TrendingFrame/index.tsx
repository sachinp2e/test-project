'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import TrendingFrameIcon1 from '../../../../Assets/_images/trending-frame-icon1.png'
import TrendingFrameIcon2 from '../../../../Assets/_images/trending-frame-icon2.png'
import TrendingFrameIcon3 from '../../../../Assets/_images/trending-frame-icon3.png'
import TrendingFrameIcon4 from '../../../../Assets/_images/trending-frame-icon4.png'
import TrendingFrameIcon5 from '../../../../Assets/_images/trending-frame-icon5.png'
import './trending-frame.scss'
import useEffectOnce from '../../../../Hooks/useEffectOnce';

interface ITrendingFrameType { }

const tabsData = [
  // {
  //   id: 1,
  //   text: 'Multi Lingual Support',
  //   logo: TrendingFrameIcon1,
  //   background:
  //     'linear-gradient(114deg, #FFCB14 0%, #FE9417 26.56%, #FF2DF7 79.86%, #D150FF 100%)',
  // },
  {
    id: 1,
    text: 'Activity System',
    logo: TrendingFrameIcon2,
    background:
      'linear-gradient(114deg, #36DFF2 0%, #6E73F4 19.97%, #7A57F4 39.01%, #DC6CEC 80.13%, #E07BEA 100%)',
  },
  {
    id: 2,
    text: 'Grievance Layer',
    logo: TrendingFrameIcon3,
    background:
      'linear-gradient(114deg, #1D0757 0%, #2A7666 19.97%, #669F72 56.94%, #BDC659 78.82%, #D4DEA2 100%)',
  },
  {
    id: 3,
    text: 'Legal Layer Protocol',
    logo: TrendingFrameIcon4,
    background:
      'linear-gradient(114deg, #36DFF2 0%, #7A57F4 33.29%, #DC6CEC 80.13%, #E07BEA 100%)',
    card1:
      'linear-gradient(114deg, #FFCB14 0%, #FE9417 26.56%, #FF2DF7 79.86%, #D150FF 100%)',
  },
  {
    id: 4,
    text: 'DLT Enabled',
    logo: TrendingFrameIcon5,
    background:
      'linear-gradient(114deg, #D4DEA2 0%, #BDC659 20.49%, #669F72 44.44%, #2A7666 68.92%, #1D0757 100%)',
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
          <div className="heading">RELIABLE, SECURE AND SEAMLESS</div>
          <p className="description">
            Our system fully integrates all features to give you a secure and
            seamless experience.
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
