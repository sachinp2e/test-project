import React from 'react';
import Masonry from 'react-masonry-css';
import AssetCard from '@/Components/AssetCard';
import CatalogCard from '@/Components/CatalogCard';
import UserCard from '@/Components/UserCard';
import { getAllCatalogs } from '@/Lib/catalogs/catalogs.action';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getAllCatalogsSelector } from '@/Lib/catalogs/catalogs.selector';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getAllUsersSelector } from '@/Lib/users/users.selector';
import { getAllUsers } from '@/Lib/users/users.action';
import { getAllAssetsSelector } from '@/Lib/assets/assets.selector';
import { getAllAssets } from '@/Lib/assets/assets.action';
import './style.scss';

interface IExploreCards {
  loading: boolean;
  showCategory: string;
  selectedDropdown?: any;
}

const breakpointColumnsObj = {
  default: 3,
  1200: 2,
  915: 1,
};

const ExploreDataSection: React.FC<IExploreCards> = (props) => {
  const { loading, showCategory, selectedDropdown } = props;
  const dispatch = useAppDispatch();
  const { assets } = useAppSelector(getAllAssetsSelector);
  const { catalogsData } = useAppSelector(getAllCatalogsSelector);
  const { usersData } = useAppSelector(getAllUsersSelector);
  const allAssets = useAppSelector(getAllAssetsSelector);

  const renderCards = () => {
    switch (showCategory) {
      case 'assets':
        return (assets || []).map((item: any) => {
          return <AssetCard key={item.id} item={item} loading={loading} />;
        });
      case 'catalogs':
        return catalogsData?.catalogs?.map((item: any) => {
          return <CatalogCard cardData={item} key={item.id} />;
        });
      case 'users':
        return usersData?.users?.map((item: any) => {
          return <UserCard cardData={item} key={item.id} />;
        });
    }
  };
  const fetchMoreData = () => {
    switch (showCategory) {
      case 'assets':
        dispatch(
          getAllAssets({
            latestPage: Number(allAssets?.latestPage) + 1,
            loadMore: true,
            filters: {...selectedDropdown}
          }),
        )
        break;
      case 'catalogs':
        dispatch(
          getAllCatalogs({
            latestPage: Number(catalogsData?.latestPage) + 1,
            loadMore: true,
            filters: {...selectedDropdown}
          }),
        );
        break;
      case 'users':
        dispatch(
          getAllUsers({
            latestPage: Number(usersData?.latestPage) + 1,
            loadMore: true,
          }),
        );
    }
  };

  const getDataLengthAndHasMore = () => {
    switch (showCategory) {
      case 'assets':
        return {
          dataLength: allAssets?.assets?.length || 0,
          hasMore: allAssets?.hasMore,
        };
      case 'catalogs':
        return {
          dataLength: catalogsData?.catalogs?.length || 0,
          hasMore: catalogsData?.hasMore,
        };
      case 'users':
        return {
          dataLength: usersData?.users?.length || 0,
          hasMore: usersData?.hasMore,
        };
      default:
        return {
          dataLength: 0,
          hasMore: false,
        };
    }
  };

  const { dataLength, hasMore } = getDataLengthAndHasMore();

  if (
    (showCategory === 'assets' && assets?.length === 0) ||
    (showCategory === 'catalogs' && catalogsData.catalogs?.length === 0) ||
    (showCategory === 'users' && usersData?.users?.length === 0)
  ) {
    return (
      <div className="d-flex align-items-center justify-content-center mt-5">
        <div style={{ fontSize: '48px', color: '#ddd' }}>No data found</div>
      </div>
    );
  }

  return (
    <div className="explore-data-section" id="scrollable-div">
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchMoreData}
        hasMore={hasMore as boolean}
        loader={<></>}
        scrollableTarget="scrollable-div">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid masonry-wrapper"
          columnClassName="my-masonry-grid_column"
        >
          {renderCards()}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
};
export default ExploreDataSection;
