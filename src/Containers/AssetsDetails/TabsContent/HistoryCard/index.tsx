import React from 'react';
import transferSvg from '@/Assets/_images/transefer.svg';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getActivityMessages } from '@/Containers/AssetsDetails/TabsContent/utils';


type Props = {
    elem:any
};

const HistoryCard = ({elem}: Props) => {

  return (
    <div className="history-card">
      <div className="left-content">
        <div className="history-icons">
          <Image src={transferSvg} alt="" />
        </div>
        <div className="title-name">
          {getActivityMessages(elem)}
          {!!elem?.price && <label>Price:{' '}${elem.price}</label>}
        </div>
      </div>
      <div className="right-content">
        <span>{dayjs(elem.transferred_at).format('DD MMM YYYY HH:mm')}</span>
      </div>
    </div>
  );
};

export default HistoryCard;
