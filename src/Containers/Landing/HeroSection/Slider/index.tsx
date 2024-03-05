'use client';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import './slider.scss';
import useEffectOnce from '@/Hooks/useEffectOnce';
import { getAllCategories } from '@/Lib/category/category.action';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getAllCategorySelector } from '@/Lib/category/category.selector';
import { ICategories } from '@/Lib/category/category.slice';
import { useRouter } from 'next/navigation';

interface ISliderType {}

const Slider: React.FC<ISliderType> = () => {
  const containerRef = useRef(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories } = useAppSelector(getAllCategorySelector);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffectOnce(() => {
    if (!categories.length) {
      dispatch(getAllCategories({}));
    }
  });

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
      className="slider-container"
    >
      {categories.map((category: ICategories, index: number) => {
        return (
          <div
            className={`${
              index === 0
                ? 'image-wrapper'
                : index === categories?.length - 1 && 'image-last-wrapper'
            } hero-slider`}
            key={category?.id}
            onClick={() => { router.push(`/explore/assets?category=${category?.name}&id=${category?.id}`); }}
          >
            <div className="left-name">{category?.name}</div>
            <Image
              src={category?.mediaUrl_resized || category?.mediaUrl}
              alt="asset-category-img"
              width={600}
              height={400}
              quality={100}
            />
            <div className="name">{category?.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Slider;
