import React from 'react';

const AudioSkeleton = () => {
  return (
    <div className="container small-size">
      <div className="skeleton-header">
        <div className="round-icon small-round" />
        <div className="round-icon small-round" />
      </div>
      <div className="skeleton-container gap-2">
        <div className="d-flex justify-content-between align-items-center ">
          <div className="round-icon small-round" />
          <div className="rectangle-icon rectangle-audio " />
          <div className="rectangle-icon third" />
        </div>
        <div className="d-flex align-items-center justify-content-between mt-4">
          <div className="d-flex flex-column gap-2">
            <div className="rectangle-icon first" />
            <div className="rectangle-icon second" />
          </div>
          <div className="d-flex gap-2 flex-column-reverse">
            <div className="rectangle-icon third" />
            <div className="rectangle-icon fourth" />
          </div>
        </div>
      </div>
      <div className="rectangle-icon skeleton-btn" />
    </div>
  );
};

export default AudioSkeleton;
