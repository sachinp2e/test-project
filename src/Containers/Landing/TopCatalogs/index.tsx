'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Button from '../../../Components/Button/index';
import ToggleTab from '../../../Components/ToggleTab/index';
import CatalogAvatar from '../../../Assets/_images/top-catalog-avatar.jpg';
import ArrowBtnImg from '../../../Assets/_images/arrow-circle-right.svg';
import StarIcon from '../../../Assets/_images/star-icone.svg';
import './topcatalogs.scss';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { useRouter } from 'next/navigation';
import { getTopCatalogs } from '@/Lib/catalogs/catalogs.action';
import { getAllCatalogsSelector } from '@/Lib/catalogs/catalogs.selector';
import { ITopCatalog } from '@/Lib/catalogs/catalogsInterface';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';
import { AssetDetailSelector } from '@/Lib/assetDetail/assetDetail.selector';

interface ITopCatalogs {
  title: string;
  desc: string;
  toggleTab: boolean;
  className?: string;
  similarAssets?: any;
}

const tabsObj = { d: '24 Hours', w: 'Last Week', m: '1 Month' };
const tabs = Object.values(tabsObj);
const paramFields = Object.keys(tabsObj);

const TopCatalogs: React.FC<ITopCatalogs> = ({
  title,
  desc,
  toggleTab,
  className,
  similarAssets,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {AssetDetails} = useAppSelector(AssetDetailSelector)
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [selectedParamField, setSelectedParamField] = useState(paramFields[0]);

  const {
    topCatalogsData: { topCatalogsByDuration },
  } = useAppSelector(getAllCatalogsSelector);

  useEffect(() => {
    switch (selectedTab) {
      case tabs[0]: {
        if (!!!topCatalogsByDuration[paramFields[0]])
          dispatch(getTopCatalogs({ pageSize: 5, duration: paramFields[0] }));
        break;
      }
      case tabs[1]: {
        if (!!!topCatalogsByDuration[paramFields[1]])
          dispatch(getTopCatalogs({ pageSize: 5, duration: paramFields[1] }));
        break;
      }
      case tabs[2]: {
        if (!!!topCatalogsByDuration[paramFields[2]])
          dispatch(getTopCatalogs({ pageSize: 5, duration: paramFields[2] }));
        break;
      }
    }
  }, [selectedTab]);

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

  const handleSelectedTab = (tabName: string) => {
    setSelectedTab(tabName);
    setSelectedParamField(
      paramFields[tabs.findIndex((tab) => tab === tabName)],
    );
  };

  return (
    <div className={`top-catalogs-main-wrapper ${className}`}>
      <div className="text-top-catalogs-main-wrapper">
        <div className="text-top-catalogs">
          {/* top Catalogs */}
          {title}
          <div className="sub-text-top-catalogs">
            <span>
              {/* Check out the video to make your journey even more easier. */}
              {desc}
            </span>
            {toggleTab && (
              <div className="top-catalogs-filter-section">
                <ToggleTab
                  tabs={tabs}
                  activeToggle={selectedTab}
                  handleTabClick={handleSelectedTab}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="top-catalogs-cards"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <GetMappedItems
          similarNfts={similarAssets}
          topCatalogsByDuration={topCatalogsByDuration}
          selectedParamField={selectedParamField}
        />
        {similarAssets ? (
          <>
            {similarAssets?.length > 3 && (
              <div className="topcatalogs-view-all">
                <span
                  onClick={() => {
                    router.push(`/catalogs/${AssetDetails?.catalogue?.id}`);
                  }}
                >
                  <span>View All</span>
                </span>
              </div>
            )}
          </>
        ) : (
          !!topCatalogsByDuration[selectedParamField]?.catalogs?.length && (
            <div className="topcatalogs-view-all">
              <span
                onClick={() => {
                  router.push('/leaderboard');
                }}
              >
                <span>View All</span>
              </span>
            </div>
          )
        )}
        {}
      </div>
    </div>
  );
};
export default TopCatalogs;

const GetMappedItems = ({
  similarNfts,
  topCatalogsByDuration,
  selectedParamField,
}: any) => {
  const router = useRouter();
  const isSimilarNfts = useMemo(() => {
    if (similarNfts) {
      return true;
    }
    return false;
  }, [similarNfts]);
  const items = !isSimilarNfts
    ? topCatalogsByDuration[selectedParamField]?.catalogs
    : similarNfts;
  return (
    <>
      {items?.length ? (
        items.map((item: any, idx: number) => (
          <div key={item?.id} className="top-catalogs-cards-img-container">
            <Image
              src={
                isSimilarNfts
                  ? item?.assetMediaUrl
                  : item?.catalogueImage_resized
              }
              className="top-catalogs-cards-img"
              alt={isSimilarNfts ? 'Similar Asset' : 'Top Catalog Image'}
              layout="fill"
              objectFit="cover"
            />
            <div className="blur-overlay">
              <div className="text-blur-overlay">
                <div className="title-text-blur-overlay">
                  {isSimilarNfts ? item?.name : item?.catalogueName}
                </div>
                <div className="sub-title-text-blur-overlay">
                  <Image
                    src={CatalogAvatar}
                    alt=""
                    height={200}
                    width={200}
                    quality={100}
                  />
                  <span>
                    {isSimilarNfts ? item?.catalogue?.name : item?.creatorName}
                  </span>
                  {isSimilarNfts && item?.catalogue?.isLegallyVerified && (
                    <Image src={StarIcon} alt="star icon" />
                  )}
                </div>
                <div className="overlay-effect-hover">
                  {!isSimilarNfts && (
                    <>
                      <div className="totalprice-overlay-effect-hover">
                        <span>Total Items: {item?.items}</span>
                      </div>
                      <div className="price-overlay-effect-hover-section">
                        <div>
                          <div>Total Catalog Sale</div>
                          <div className="sub-price-overlay-effect-hover">
                            ${item?.totalEarnings || 0}
                          </div>
                        </div>
                        <div className="vertical-line-overlay-effect-hover">
                          |
                        </div>
                        <div>
                          <div>Min Asset price</div>
                          <div className="sub-price-overlay-effect-hover">
                            ${item?.floorprice || 0}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="btn-overlay-effect-hover">
                    <Button
                      className="view-catalog-btn"
                      onClick={() => {
                        if (isSimilarNfts) {
                          return router.push(`/asset-details/${item.id}`);
                        }
                        router.push(`/catalogs/${item?.catalogueId}`);
                      }}
                      element={
                        <div className="d-flex align-items-center">
                          <span className="me-2">
                            {isSimilarNfts ? 'View Asset' : 'View Catalog'}
                          </span>
                          <Image src={ArrowBtnImg} alt="arrow" />
                        </div>
                      }
                      isFilled
                      isGradient
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="d-flex align-items-center justify-content-center mt-5 mx-auto">
          <div style={{ fontSize: '48px', color: '#ddd' }}>
            {isSimilarNfts ? 'No Similar Assets' : 'No top catalogs'}
          </div>
        </div>
      )}
    </>
  );
};
