import React from 'react';
import Masonry from 'react-masonry-css';
import './style.scss';

interface IMasonryLayoutType {
  children: any;
  configObj?: any;
}

const breakpointColumnsObj = {
  default: 3,
  1024: 2,
  700: 1,
};

const MasonryLayout: React.FC<IMasonryLayoutType> = (props) => {
  return (
    <div className="masonry-layout-wrapper">
      <Masonry
        breakpointCols={{ ...breakpointColumnsObj, ...props.configObj }}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {props.children}
      </Masonry>
    </div>
  );
};

export default MasonryLayout;
