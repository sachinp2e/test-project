// This component is a memoized component that shows the timer for the asset card in the marketplace.
import React, { useState } from 'react';
import dayjs from 'dayjs';

interface IShowTimer {
  bidEndDate: string;
}

const ShowTimer: React.FC<IShowTimer> = React.memo(({ bidEndDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const dateDifference = () => {
    const diff = dayjs(bidEndDate).diff(dayjs(), 'second');
    setTimeLeft({
      hours: Math.floor(diff / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: Math.floor((diff % 3600) % 60),
    });
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      dateDifference();
    }, 1000);
    return () => clearInterval(timer);
  }, [bidEndDate]);

  return (
    <>
      Time left: {' '}
      <b>{timeLeft.hours}</b>hrs{' '}
      <b>{timeLeft.minutes}</b>min{' '}
      <b>{timeLeft.seconds}</b>sec
    </>
  );
});

export default ShowTimer;
