'use client';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { teamMembersData } from './data';
import './team-slider.scss';

interface IData {
    id: number,
    image: ImageBitmap,
    name: string,
    designation: string
}

const TeamSlider = () => {
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
  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="team-slider-container"
    >
      {teamMembersData.map((member: any, index: number) => {
        return (
          <div
            className={`${
              index === 0
                ? 'image-wrapper'
                : index === teamMembersData?.length - 1 && 'image-last-wrapper'
            } member-slider`}
            key={member?.id}
          >
            <Image
              src={member.image}
              alt="team-member-img"
              width={1000}
              height={1000}
              quality={100}
            />
            <div className="member-info-wrapper">
             <div className='gradient-top'></div>
             <div className='member-info'>
                <span>{member.name}</span>
                <span>{member.designation}</span>
             </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamSlider;
