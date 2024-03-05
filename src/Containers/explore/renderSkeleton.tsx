import React from 'react';
import Masonry from 'react-masonry-css';
import Skeleton from '@/Components/SkeletonLoader';

interface ISkeleton {}

const RenderSkeleton: React.FC<ISkeleton> = () => {
  return (
    <div className="explore-data-section" id="scrollable-div">
      <Masonry
        breakpointCols={{
          default: 3,
          1440: 2,
          915: 1,
        }}
        className="my-masonry-grid masonry-wrapper"
        columnClassName="my-masonry-grid_column"
      >
        {
          Array.from(Array(12).keys()).map((item) => {
            return (
              <Skeleton cardType={item % 2 === 0 ? 'VIDEO' : item % 3 === 0 ? 'AUDIO' : 'IMAGE'} />
            )
          })
        }
      </Masonry>
    </div>
  );
};

export default RenderSkeleton;
