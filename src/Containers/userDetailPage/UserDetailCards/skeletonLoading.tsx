import React from 'react';
import Masonry from 'react-masonry-css';
import Skeleton from '@/Components/SkeletonLoader';

const SkeletonLoading = () => {
  return (
      <Masonry
        breakpointCols={{
          default: 3,
          1200: 2,
          915: 1,
        }}
        className="my-masonry-grid masonry-wrapper masonry-skeleton"
        columnClassName="my-masonry-grid_column"
      >
        {
          Array.from(Array(9).keys()).map((item,idx:number) => {
            return (
              <Skeleton cardType={item % 2 === 0 ? 'VIDEO' : item % 3 === 0 ? 'AUDIO' : 'IMAGE'} key={idx}/>
            )
          })
        }
      </Masonry>
  );
};

export default SkeletonLoading;
