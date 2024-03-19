'use client';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Image from 'next/image';
import './catalogs.scss';
import LocalSearch from '@/Components/localSearchBar';
import { VerifiedSign } from '@/Assets/svg';
import CatalogAvatar from '../../Assets/_images/top-catalog-avatar.jpg';
import FilterSection from '@/Components/filterSection';
import AssetCard from '../../Components/AssetCard/index';
import MasonryLayout from '../../Components/MasonryLayout/index';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getAllCatalogsSelector } from '@/Lib/catalogs/catalogs.selector';
import useEffectOnce from '@/Hooks/useEffectOnce';
import {
  favUnfavCatalogAction,
  getAssetsById,
  getCataLogDetails,
} from '@/Lib/catalogs/catalogs.action';
import { useParams } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import CustomFavAndUnFav from '@/Components/CustomFavourite';
import { authSelector } from '@/Lib/auth/auth.selector';

const Catalogs = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector(authSelector);
  const {
    catalogsData: { catalogDetails },
    assetsData: { catalogAssets },
  } = useAppSelector(getAllCatalogsSelector);

  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [favBtn, setFavBtn] = useState<boolean>(
    catalogDetails?.isFavourite || false,
  );
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [filteredAssets, setFilteredAssets] = useState<any[]>([]);

  useEffectOnce(() => {
    dispatch(getCataLogDetails({ id: `${params?.id}` })).then((res) => {
      if (res?.payload?.resObj.id) {
        setFavBtn(res?.payload?.resObj?.isFavourite);
      }
    });
  });

  useEffect(() => {
    dispatch(
      getAssetsById({
        catalogId: `${params?.id}`,
        filters: { search: search },
      }),
    );
  }, [search]);

  const handleToggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleLikeUnlikeBtn = async () => {
    try {
      if (isDebouncing) {
        return;
      }
      setIsDebouncing(true);
      setTimeout(() => {
        setIsDebouncing(false);
      }, 500);
      const response = await dispatch(
        favUnfavCatalogAction({
          userId: userId,
          catalogueId: `${params?.id}`,
          isFavourite: !catalogDetails.isFavourite,
        }),
      );
      if (response.payload?.catalogId) {
        setFavBtn(!catalogDetails.isFavourite);
      } else if (response.payload?.customErrorNumber) {
        throw new Error('Something went wrong!');
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const filterColSize = isFilterVisible ? 3 : 0;

  const fetchMoreData = () => {
    dispatch(
      getAssetsById({
        catalogId: `${params?.id}`,
        latestPage: Number(catalogAssets?.latestPage) + 1,
        filters: { search: search },
        loadMore: true,
      }),
    );
  };

  const abbreviateNumber = (count: number) => {
    if (count < 1000) {
      return count;
    } else if (count > 999 && count < 10000) {
      return (count / 1000).toFixed(2) + 'K';
    } else if (count > 9999 && count < 1000000) {
      return Math.floor(count / 1000) + 'K';
    } else if (count > 999999 && count < 1000000000) {
      return (count / 1000000).toFixed(2) + 'M';
    } else {
      return (count / 1000000000).toFixed(2) + 'B';
    }
  };

  return (
    <>
      <div className="catalogs-container">
        <Row className="catalogs-row">
          <Col lg={4}>
            <>
              <div className="catalogs-picture">
                {catalogDetails?.creator?.profileImage ? (
                  <Image
                    src={
                      catalogDetails?.image ||
                      catalogDetails?.creator?.profileImage ||
                      CatalogAvatar
                    }
                    height={500}
                    width={500}
                    quality={100}
                    alt="profile-image"
                  />
                ) : (
                  <div className="name-initials">
                    {catalogDetails?.creator?.firstName &&
                      catalogDetails?.creator?.firstName[0].toUpperCase()}
                    {catalogDetails?.creator?.lastName &&
                      catalogDetails?.creator?.lastName[0].toUpperCase()}
                  </div>
                )}
              </div>
              {/* <div className="share-icons">
                <label htmlFor="">Share</label>{' '}
                <div className="social-icons">
                  <Facebook />
                  <Twiiter />
                  <Linkedin />
                  <Instagram />
                  <Discord />
                  <LinkFile />
                </div>
              </div> */}
            </>
          </Col>
          <Col lg={8}>
            <div className="catalogs-desc">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="catalogs-name">{catalogDetails?.name}</div>
                  <div className="creator-name">
                    <p>
                      Created by:{' '}
                      <span>{catalogDetails?.creator?.userName}</span>{' '}
                      {catalogDetails?.creator?.isKycVerified && (
                        <VerifiedSign />
                      )}
                    </p>
                  </div>
                </div>

                <div className="favourite" style={{ cursor: 'pointer' }}>
                  <CustomFavAndUnFav
                    favBtn={favBtn}
                    handleLikeUnlikeBtn={handleLikeUnlikeBtn}
                  />
                </div>
              </div>

              <div className="catalog-description">
                <p>{catalogDetails?.description}</p>
              </div>
              <div className="follower-following">
                <div className="box-details one">
                  <span>Item </span>
                  <label htmlFor="">
                    {abbreviateNumber(catalogDetails?.assetCount)}
                  </label>
                </div>
                <div className="box-details two">
                  <span>Min Asset Price </span>
                  <label htmlFor="">
                    {abbreviateNumber(catalogDetails?.floorPrice) || 0}
                  </label>
                </div>
                <div className="box-details three">
                  <span>Total Catalog Sale</span>
                  <label htmlFor="">
                    {abbreviateNumber(catalogDetails?.volume) || 0}
                  </label>
                </div>
                <div className="box-details four">
                  <span>Best Offer </span>
                  <label htmlFor="">
                    {catalogDetails?.highestOffer || `No offers yet`}
                  </label>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <LocalSearch handleSearch={setSearch} />
          </Col>
        </Row>
      </div>
      {!!catalogAssets?.assets?.length ? (
        <div className="explore-cards">
          {/* Temporarily hidden filter bar */}
          {/* {!isFilterVisible && (
          <Button
            className="filter-button"
            onClick={handleToggleFilter}
            element={<Image src={filterIcon} alt="filter" />}
          />
        )} */}
          <div className="explore-filter-container">
            <Row>
              {isFilterVisible && (
                <Col lg={filterColSize}>
                  <FilterSection
                    handleToggleFilter={handleToggleFilter}
                    isFilterVisible={isFilterVisible}
                  />
                </Col>
              )}
              <Col lg={12 - filterColSize} id="scrollable-div">
                <InfiniteScroll
                  dataLength={catalogAssets?.assets?.length || 0}
                  next={fetchMoreData}
                  hasMore={catalogAssets?.hasMore}
                  loader={<></>}
                  scrollableTarget="scrollable-div"
                >
                  <MasonryLayout
                    configObj={{ default: isFilterVisible ? 3 : 4 }}
                  >
                    {catalogAssets?.assets?.map((item: any, idx: number) => {
                      return <AssetCard item={item} key={`asset_${idx}`} />;
                    })}
                  </MasonryLayout>
                </InfiniteScroll>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-center my-5">
          <div style={{ fontSize: '48px', color: '#ddd' }}>No assets found</div>
        </div>
      )}
    </>
  );
};

export default Catalogs;
