import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import duration from 'dayjs/plugin/duration';
import { AuctionEnds } from '@/Assets/svg';
import { useParams } from 'next/navigation';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(duration);

function AuctionTimer({ bidEndDate, bidStartDate, card = false }: any) {
  const { userId = "" } = useParams();
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [timezone, setTimezone] = useState('');
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    const getUserTimezone = () => {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(userTimezone);
    };
    getUserTimezone();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const calculateRemainingTime = () => {
      let targetDate: dayjs.Dayjs;
      if (dayjs().isSameOrAfter(dayjs(bidStartDate))) {
        setAuctionStarted(true);
        targetDate = bidEndDate;
      } else {
        setAuctionStarted(false);
        targetDate = bidStartDate;
      }

      intervalId = setInterval(() => {
        const newRemainingTime = dayjs(targetDate)
          .tz()
          .diff(dayjs(), 'milliseconds');
        setRemainingTime(newRemainingTime);
      }, 1000);
    };

    calculateRemainingTime();

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [bidEndDate, bidStartDate, timezone]);

  const auctionText = useMemo(() => {
    if (remainingTime !== null) {
      if (remainingTime > 0 && auctionStarted) {
        const durationObj = dayjs.duration(remainingTime);
        return (
          <div className={`auction-ends ${userId ? 'offer-timer' : ''}`}>
            {/* <AuctionEnds /> */}
            <div className={`bidding-live-indicator`} />
            <span>
             {card ?'Time Left:' :'Auction Ends in:'} {' '}
              <b>
                {durationObj.days() > 0
                  ? `${durationObj.days()}day
                ${durationObj.hours()}hrs ${durationObj.minutes()}min`
                  : `${durationObj.hours()}hrs
                ${durationObj.minutes()}min ${durationObj.seconds()}sec`}
              </b>
            </span>
          </div>
        );
      } else if (remainingTime < 0) {
        return (
          <div className="auction-ends">
            <div className={`bidding-live-indicator closed`} />
            <span>
              Auction Ended on:{' '}
              <b>{dayjs(bidEndDate).format('D MMMM, YYYY')}</b>
            </span>
          </div>
        );
      }
    }
  }, [remainingTime, auctionStarted, bidEndDate]);

  if (remainingTime === 0) {
    return <></>;
  }

  return <> {remainingTime ? auctionText : ''}</>;
}

export default AuctionTimer;
