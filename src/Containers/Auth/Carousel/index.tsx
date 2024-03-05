import React from 'react';
import Image from 'next/image';
// import AuthLeftSection from '@/Assets/_images/auth-left-section.gif';
import AuthLeftSection from '@/Assets/_images/login_1.svg'
import './carousel.scss';

interface ICarouselType {
}

const Carousel: React.FC<ICarouselType> = () => {

  return (
    <div className="carousel-container">
      <div className="center-container">
        <Image src={AuthLeftSection} alt="" width={1000} height={1000} />
      </div>
    </div>
  );

};

export default Carousel;
