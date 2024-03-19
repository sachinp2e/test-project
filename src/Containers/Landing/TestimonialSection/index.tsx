'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import MyIPRLogo from '@/Assets/_images/MyIprLogo.svg'
import MayaaVerseLogo from '@/Assets/_images/MayaaVerse.png';
import KalpStudioLogo from '@/Assets/_images/KalpStudio.png'
import Avatar from '../../../Assets/_images/avatar.svg';
import './testimonial.scss';

interface ITestimonialsType {}

const data = [
  {
    id: 1,
    Avatar: Avatar,
    username: 'Ashish Minocha',
    Designation: 'CBO of Mayaa-Verse',
    description:
      'Working with the NiftiQ marketplace has been a game-changer for us. Their expertise and asset library have elevated our metaverse projects, making our digital experiences truly immersive. Highly recommend their services.',
    logo: MayaaVerseLogo,
  },
  {
    id: 2,
    Avatar: Avatar,
    username: 'Harshit Ralhan',
    Designation: ' Brand Conduit at MyIPR',
    description:
      'At MyIPR, we extend our heartfelt gratitude to NiftiQ for their seamless collaboration and assistance in protecting the intellectual property rights of creators. Their expertise has been invaluable in our mission to safeguard creative endeavors.',
    logo: MyIPRLogo,
  },
  {
    id: 3,
    Avatar: Avatar,
    username: 'Ruchit Saxena',
    Designation: 'Product Owner at Kalp Studio',
    description:
      'The NiftiQ marketplace has played a pivotal role in providing us with essential assets to enhance the blockchain experience for our users.',
    logo: KalpStudioLogo,
  },
  {
    id: 4,
    Avatar: Avatar,
    username: 'Rachel',
    Designation: 'Digital Artist',
    description:
      'I am immensely grateful for the NFT marketplace. It has provided me with an invaluable platform to showcase and monetize my digital creations. The exposure, community support, and seamless experience have truly transformed mycreative journey.',

  },
];

const Testimonials: React.FC<ITestimonialsType> = () => {
  const [isFullTextVisible, setIsFullTextVisible] = useState<number[]>([]);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    //@ts-ignore
    setStartX(e.pageX - containerRef.current.offsetLeft);
    //@ts-ignore
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging) return;
    e.preventDefault();
    //@ts-ignore

    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    //@ts-ignore
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const toggleTextVisibility = (testimonialId: number) => {
    setIsFullTextVisible((prevExpanded) =>
      prevExpanded.includes(testimonialId)
        ? prevExpanded.filter((id) => id !== testimonialId)
        : [...prevExpanded, testimonialId],
    );
  };

  return (
    <div className="container-fluid testimonials-main-wrapper">
      <div className="text-testimonials-main-wrapper">
        <div className="text-testimonials">
            Testimonials
          <div className="sub-text-testimonials">
            Discover What Users Love About Us!
          </div>
        </div>
      </div>
      <div
        className="card-testimonials-main-wrapper"
        style={{ overflowX: 'auto', cursor: 'pointer' }}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {data.map((item, index) => (
          <div className="sub-card-testimonials-main-wrapper" key={index}>
            <div className="card-testimonials-header">
              <Image src={item.Avatar} alt="avatar" />
              <span className="card-testimonials-user-name">
                {item.username}
              </span>
              <span>|</span>
              <span className="card-testimonials-user-designation">{item.Designation}</span>
              <span>|</span>
              {item.logo && (
              <span className="card-testimonials-user-image">
                <Image src={item.logo} alt="logo" />
              </span>
              )}
            </div>
            <div className="card-testimonials-text">
                {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
