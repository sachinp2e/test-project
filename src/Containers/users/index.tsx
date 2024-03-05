'use client';
import Image from 'next/image';
import './users.scss';
import React, { useState } from 'react';
import userCover from '@/Assets/_images/user-cover-1.png';
import userProfile from '@/Assets/_images/user-profile.png';
import { FacebookIcon, HeartIocn, LinkedinIcon, MoreIocn, ShareIcon, TwitterIcon, } from '@/Assets/svg';
import { Col, Row } from 'react-bootstrap';
import Button from '@/Components/Button';
import ToggleTab from '@/Components/ToggleTab';
import filterIcon from '@/Assets/_images/filter.svg';
// import FilterSection from '@/Components/filterSection';
import TrendingCard from '@/Containers/Landing/TrendingSection';
import LocalSearch from '@/Components/localSearchBar';
import FilterSection from '@/Components/filterSection';

const Users = () => {
  const [open, setOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const filterColSize = isFilterVisible ? 3 : 0;
  const tabs = [
    'Collected',
    'Created',
    'Catalogs',
    'On Sale',
    'Favourites',
    'Following',
    'History',
  ];
  const toggleTabs = ['Assets', 'Catalogs'];
  const handleArrow = () => {
    setOpen(!open);
  };
  const handleToggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  return (
    <>
      <div className="user-container">
        <div className="user-cover">
          <Image src={userCover} alt="" />
          <div className="icons">
            <ShareIcon />
            <HeartIocn />
            <MoreIocn />
          </div>
        </div>
        <Row className="profile-desc">
          <Col lg={3} className="profile-col">
            <div className="user-profile">
              <div className="profile-pic">
                <Image src={userProfile} alt="" />
              </div>
              <div className="username">Jayesh</div>
              <div className="social-icons">
                <FacebookIcon />
                <TwitterIcon />
                <LinkedinIcon />
              </div>
              <div className="Kalp-id">
                Kalp ID: <p>0561...8922D</p>{' '}
                <div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_1106_8074"
                      style={{ maskType: 'alpha' }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                    >
                      <rect width="20" height="20" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_1106_8074)">
                      <path
                        d="M7.5 14.9993C7.04167 14.9993 6.64931 14.8362 6.32292 14.5098C5.99653 14.1834 5.83333 13.791 5.83333 13.3327V3.33268C5.83333 2.87435 5.99653 2.48199 6.32292 2.1556C6.64931 1.82921 7.04167 1.66602 7.5 1.66602H15C15.4583 1.66602 15.8507 1.82921 16.1771 2.1556C16.5035 2.48199 16.6667 2.87435 16.6667 3.33268V13.3327C16.6667 13.791 16.5035 14.1834 16.1771 14.5098C15.8507 14.8362 15.4583 14.9993 15 14.9993H7.5ZM7.5 13.3327H15V3.33268H7.5V13.3327ZM4.16667 18.3327C3.70833 18.3327 3.31597 18.1695 2.98958 17.8431C2.66319 17.5167 2.5 17.1243 2.5 16.666V5.83268C2.5 5.59657 2.57986 5.39865 2.73958 5.23893C2.89931 5.07921 3.09722 4.99935 3.33333 4.99935C3.56944 4.99935 3.76736 5.07921 3.92708 5.23893C4.08681 5.39865 4.16667 5.59657 4.16667 5.83268V16.666H12.5C12.7361 16.666 12.934 16.7459 13.0938 16.9056C13.2535 17.0653 13.3333 17.2632 13.3333 17.4993C13.3333 17.7355 13.2535 17.9334 13.0938 18.0931C12.934 18.2528 12.7361 18.3327 12.5 18.3327H4.16667Z"
                        fill="black"
                      />
                    </g>
                  </svg>
                </div>
              </div>

              <Button text="Follow" className="user-follow" />
            </div>
          </Col>
          <Col lg={8}>
            <div className="user-description">
              <div className="description">
                Lorem ipsum dolor sit amet consectetur. Pharetra ipsum nisl
                convallis sem commodo feugiat molestie quis. Nisl accumsan risus
                cursus tellus in dis. Mi commodo bibendum lorem in scelerisque
                et. Quam vel turpis est diam sed commodo eget. Aenean massa
                adipiscing tortor dignissim. Diam turpis arcu id amet risus
                amet. Etiam vel velit sapien sed sit in sit odio elementum.
                Habitasse.
              </div>
              <p>
                Joined on: <span>21st March 2023</span>
              </p>
              <div className="follower-following">
                <div className="followers">
                  <span>Followers</span>
                  <label htmlFor="">342</label>
                </div>
                <div className="followers">
                  <span>Following </span>
                  <label htmlFor="">399</label>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="custom-tabs">
          <ToggleTab tabs={tabs} activeToggle={tabs[0]} />
        </div>

        <Row className="local-searchBar">
          <Col lg={3}>
            <LocalSearch />
          </Col>
          <Col lg={9}>
            <div className="custom-toogle-tab">
              <ToggleTab tabs={toggleTabs} activeToggle={toggleTabs[0]} />
            </div>
          </Col>
        </Row>
      </div>
      <div className="explore-cards">
        {!isFilterVisible && (
          <Button
            className="filter-button"
            onClick={handleToggleFilter}
            element={(
              <div>
                <Image src={filterIcon} alt="" />
              </div>
            )}
          />
        )}
        <div className="explore-filter-container">
          <Row className="p-0 m-0">
            {isFilterVisible && (
              <Col lg={filterColSize} className="p-0 m-0">
                <FilterSection handleToggleFilter={handleToggleFilter} />
              </Col>
            )}
            <Col lg={12 - filterColSize} className="p-0 m-0">
              <TrendingCard />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Users;
