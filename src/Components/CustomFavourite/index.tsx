import React, { useEffect, useState } from 'react';
import "./fav.scss"

interface ICustomFavAndUnFav {
  favBtn: boolean;
  handleLikeUnlikeBtn?: ()=>void;
}

const CustomFavAndUnFav: React.FC<ICustomFavAndUnFav> = (props) => {
  const { favBtn, handleLikeUnlikeBtn } = props;

  return (
    <>
      <div id="main-content">
        <div>
          <input
            type="checkbox"
            id="checkbox"
            checked={favBtn}
            onChange={handleLikeUnlikeBtn}
          />
          <label htmlFor="checkbox">
            <svg
              id="heart-svg"
              viewBox="467 392 58 57"
              xmlns="http://www.w3.org/2000/svg"
              style={{width:'40px'}}
            >
              <g
                id="Group"
                fill="none"
                fillRule="evenodd"
                transform="translate(467 392)"
              >
                <path
                  d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z"
                  id="heart"
                  fill="#AAB8C2"
                />
                <circle
                  id="main-circ"
                  fill="#E2264D"
                  opacity="0"
                  cx="29.5"
                  cy="29.5"
                  r="1.5"
                />

                {/* Groups omitted for brevity */}
              </g>
            </svg>
          </label>
        </div>
      </div>
      {/* <Image
        src={images[currentImage]}
        alt={`Image ${currentImage + 1}`}
      /> */}
    </>
  );
};
export default CustomFavAndUnFav;
