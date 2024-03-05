import React, { useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Link from 'next/link';
import CreditIcon from '@/Assets/_images/creditIcon.png';
import { useRouter } from 'next/navigation';
import { MyIprIcon } from '@/Assets/svg';
import Button from '@/Components/Button';
import Image from 'next/image';
import './tabs.scss';

interface ITabs {
  isSticky?: boolean;
}

interface IDataItem {
  id: number;
  img: React.ReactNode;
}

const data: IDataItem[] = [
  {
    id: 1,
    img: <MyIprIcon />,
  },
  {
    id: 2,
    img: <MyIprIcon />,
  },
  {
    id: 3,
    img: <MyIprIcon />,
  },
];

const Tabs: React.FC<ITabs> = (props) => {
  const { isSticky } = props;
  const [subscribe, setSubscrib] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const target = useRef<any>(null);
  const router = useRouter();

  const handleSubscribe = (id: number) => {
    if (id === 1) {
      setSubscrib(true);
    }
  };
  const scrollToVideoSection = () => {
    const videoSectionElement = document.querySelector('.main-video-section-wrapper');
    if (videoSectionElement) {
      videoSectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tooltip = (
    <Tooltip id="tooltip" className="apps-tooltip-container">
      <div className="apps-modal-conatiner">
        {data.map((item) => (
          <div key={item.id}>
            <div className="apps-modal">
              {item.img}
              {(subscribe && item.id === 1) ? (
                <div className="credits-wrapper" onClick={() => setShow(!show)}>
                  <Image src={CreditIcon} alt="credit" />
                  <span>Credits: 5</span>
                </div>
              ) : (
                <Button text="Subscribe" className="myipr-button" onClick={() => handleSubscribe(item.id)} />
              )}
            </div>
            <hr className="horizontal-rule" />
          </div>
        ))}
      </div>
    </Tooltip>
  );

  return (
    <div className={`subnav-tabs-container ${isSticky ? 'text-white' : ''}`}>
      {!isSticky && <div className ="leaderboard-cursor"onClick={scrollToVideoSection}>How it Works</div>}
      <div onClick={() => router.push('/leaderboard')} className="leaderboard-cursor">Leaderboard</div>
      <div onClick={() => router.push('/subscription')} className="leaderboard-cursor">Apps</div>
      {/* <OverlayTrigger
        target={target.current}
        placement="bottom-start"
        overlay={tooltip}
        trigger="click"
        rootClose
      >
        <div className="app-cursor">
          <Link href="/subscription">Apps</Link>
        </div>
      </OverlayTrigger> */}
    </div>
  );
};

export default Tabs;
