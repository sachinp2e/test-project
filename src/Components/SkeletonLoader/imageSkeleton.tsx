import React from 'react';

const ImageSkeleton = () => {
  return (
    <div className="container small-size">
      <div className="skeleton-header">
        <div className="round-icon small-round" />
        <div className="round-icon small-round" />
      </div>
      <div className="skeleton-container gap-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex flex-column gap-2 center-place w-">
            <div className="rectangle-icon first" />
            <div className="rectangle-icon second" />
            <div className="rectangle-icon five" />
          </div>
        </div>
      </div>
      <div className="rectangle-icon skeleton-btn" />
    </div>
  );
};

export default ImageSkeleton;
