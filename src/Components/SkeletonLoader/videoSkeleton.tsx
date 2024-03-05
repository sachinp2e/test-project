import React from 'react';

const VideoSkeleton = () => {
  return (
    <div className="container big-size">
      <div className="skeleton-header">
        <div className="round-icon big-round" />
        <div className="d-flex align-items-center justify-content-between flex-column gap-2">
          <div className="rectangle-icon rectangle-round" />
          <div className="rectangle-icon rectangle-header" />
        </div>
        <div className="round-icon big-round" />
      </div>
      <div className="round-icon big-round" />
      <div className="skeleton-container gap-8">
        <div className="d-flex flex-column gap-2">
          <div className="rectangle-icon rectangle-container" />
          <div className="input-icon" />
        </div>
        <div className="d-flex align-items-center justify-content-between">
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

export default VideoSkeleton;
