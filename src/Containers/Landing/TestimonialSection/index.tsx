'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import LightAI from '../../../Assets/_images/lightAI.svg';
import Avatar from '../../../Assets/_images/avatar.svg';
import './testimonial.scss';

interface ITestimonialsType {}

const data = [
  {
    id: 1,
    Avatar: Avatar,
    username: 'first',
    Designation: 'Designation',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    logo: LightAI,
  },
  {
    id: 2,
    Avatar: Avatar,
    username: 'second',
    Designation: 'Designation',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    logo: LightAI,
  },
  {
    id: 3,
    Avatar: Avatar,
    username: 'third',
    Designation: 'Designation',
    description:
      'Lorem ipsum dolor sit amet,consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.dolor sit amet, consectetur adipiscing elit. Sed do consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    logo: LightAI,
  },
  {
    id: 4,
    Avatar: Avatar,
    username: 'fourth',
    Designation: 'Designation',
    description:
      'Lorem ipsum dolor sit amet,consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.dolor sit amet, consectetur adipiscing elit. Sed do consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.dolor , consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    logo: LightAI,
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
          testimonials
          <div className="sub-text-testimonials">
            See what the users have to say about us
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
              <span className="card-testimonials-user-name">|</span>
              <span>{item.Designation}</span>
              <span className="card-testimonials-user-name">
                |<Image src={item.logo} alt="logo" />
              </span>
            </div>
            <div className="card-testimonials-text">
              {isFullTextVisible.includes(item.id)
                ? item.description
                : `${item.description.slice(0, 100)}...`}
              <button onClick={() => toggleTextVisibility(item.id)}>
                {isFullTextVisible.includes(item.id)
                  ? 'show less'
                  : 'show more'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
