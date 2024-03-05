import React from 'react';
import transferSvg from '@/Assets/_images/transefer.svg';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';


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
          <span>
            Transferred from
            <Link href={`/user/${elem?.previous_owner_id}`}>
              <b>
                {' '}
                {elem.previous_owner_firstname} {elem.previous_owner_lastname}{' '}
              </b>
            </Link>{' '}
            to{' '}
            <Link href={`/user/${elem?.new_owner_id}`}>
              <b>
                {' '}
                {elem.new_owner_firstname} {elem.new_owner_lastname}{' '}
              </b>
            </Link>
          </span>
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
