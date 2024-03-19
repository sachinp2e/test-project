import React, { useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Link from 'next/link';
import CreditIcon from '@/Assets/_images/creditIcon.png';
import { useRouter } from 'next/navigation';
import { MyIprIcon } from '@/Assets/svg';
import Button from '@/Components/Button';
import Image from 'next/image';
import './tabs.scss';
import MyIPRIcon from '@/Assets/_images/myipr-alert-icon.png';
import {  useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import useEffectOnce from '@/Hooks/useEffectOnce';
import { getMyiprUserCredits } from '@/Lib/auth/auth.action';
import axiosInstance from '@/Lib/axios';
import { toastErrorMessage } from '@/utils/constants';



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
  }
];


const Tabs: React.FC<ITabs> = (props) => {
  const { isSticky } = props;
  const [subscribe, setSubscrib] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const target = useRef<any>(null);
  const router = useRouter();
  const { myiprCredits } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const [addcredit ,setaddcredit] = useState<boolean>(false);


  useEffectOnce(() => {
    dispatch(getMyiprUserCredits());
    if (myiprCredits === 0 ){
      setaddcredit(true);
    }
  });
  
  const handleAddCredits = async () => {
    try {
      const response = await axiosInstance.post(`/user/redirect_url/`, {
        addCredit: true,
      });
      if (response.data?.result?.url) {
        window.open(response.data.result.url, '_blank');
      }
    } catch (error) {
      toastErrorMessage('Something went wrong while redirecting, Please try after some time.')
      console.error('Error while fetching certificate url', error);
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
         <div className="tooltip-app-dropdown">
        
         <span onClick={() => window.open('https://qa-myipr.p2eppl.com/')}><MyIprIcon width='100px' height='25px' /></span>
        {!addcredit ? (
        <div className="available-credits">
          <Image src={MyIPRIcon} alt="" />
          <label>Credits: </label>
          <span>{myiprCredits}</span>
        </div>
        ):(
          <Button
          isFilled
          isGradient
          text="Add Credits"
          onClick={handleAddCredits}
        />
        )}
      </div>
    </Tooltip>
  );

  return (
    <>
    <div className={`subnav-tabs-container ${isSticky ? 'text-white' : ''}`}>
      {!isSticky && <div className ="leaderboard-cursor"onClick={scrollToVideoSection}>How it Works</div>}
      <div onClick={() => router.push('/leaderboard')} className="leaderboard-cursor">Leaderboard</div>
      <OverlayTrigger
        target={target.current}
        placement="bottom-start"
        overlay={tooltip}
        trigger="click"
        rootClose
      >
        <div className="app-cursor">
          <span>Apps</span>
        </div>
      </OverlayTrigger>
    </div>

      </>
  );
};

export default Tabs;
