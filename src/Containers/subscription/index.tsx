'use client'
import React, { useState } from 'react';
import Image from 'next/image'
import Button from '../../Components/Button/index';
import MaiCityIcon from '../../Assets/_images/mai-city-icon.svg'
import MyIprAlertIcon from '../../Assets/_images/myipr-alert-icon.png'
import DottedAnimation from '../../Assets/_images/dotted-animation.svg'
import {
  MyIprIcon,
  SmartIcon,
  DiagonallyArrow
} from "../../Assets/svg";
import './style.scss'

interface ISubscriptionCards {
}

const Data = [
  {
    id: 0,
    credits: 10,
    icon: <MyIprIcon width="125" height="37"/>,
    description: "Lorem ipsum dolor sit amet consectetur. Risus viverra commodo semper metus nunc tortor nisi ante. Diam urna erat cras sagittis ac ut mauris etiam at at id.",
  },
  {
    id: 1,
    credits: 18,
    icon: <SmartIcon/>,
    description: "Lorem ipsum dolor sit amet consectetur. Risus viverra commodo semper metus nunc tortor nisi ante. Diam urna erat cras sagittis ac ut mauris etiam at at id.",
  },
  {
    id: 2,
    credits: 15,
    icon: <Image src={MaiCityIcon} alt=""/>,
    description: "Lorem ipsum dolor sit amet consectetur. Risus viverra commodo semper metus nunc tortor nisi ante. Diam urna erat cras sagittis ac ut mauris etiam at at id.",
  },
]

const SubscriptionCards: React.FC<ISubscriptionCards> = () => {
  const [subscribeStates, setSubscribeStates] = useState<{ [key: number]: boolean }>({});

  const handleSubscribe = (id: number) => {
    setSubscribeStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  }

  return (
    <>
      <div className="subscription-wrapper">
        <h1>APPS</h1>
        <div className="sub-subscription ">
          {
            Data.map((item, index) => (
            <div
              key={item.id}
              className="position-relative">
              {index === 0 && <Image src={DottedAnimation} alt="" className="dotted-animation z-n1" />}
              <div className='sub-card'>
                <div className="card-container">
                  {item.icon}
                  <p>{item.description}</p>
                  <div className='d-flex align-items-center justify-content-between'>
                    <Button
                      isFilled={!subscribeStates[item.id]}
                      isGradient={!subscribeStates[item.id]}
                      onClick={() => handleSubscribe(item.id)}
                      className={`subscribe-btn ${subscribeStates[item.id] ? "subscribe" : ""}`}
                      element={!subscribeStates[item.id] ? (<p>Subscribe</p>) :
                        <div className="d-flex align-items-center justify-content-around gap-2">
                          <Image src={MyIprAlertIcon} alt="" />
                          <p>Credits: {item.credits}</p>
                        </div>}
                    />
                    <DiagonallyArrow />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export default SubscriptionCards
