import React from 'react';
import CatalogCard from '../../../Components/CatalogCard/index';
// import TrendingCard from '../../Landing/TrendingSection/TrendingCards/SelectTrendingcard/index';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import AssetCard from '@/Components/AssetCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import './style.scss';
import ProfileDropdownComponent from '../ProfileDropdown';
import NoBidsData from '../NoBidsData';
import { bidsObjHandler, offersObjHandler } from './AssetCardDataHandlers';
import { getAllUsersSelector } from '@/Lib/users/users.selector';
import {
  getAllMyDrafts,
  getAllPlacedBids,
  getAllPlacedOffers,
  getAllReceivedBids,
  getAllReceivedOffers,
  getAllUserCatalogs,
  getAllUserFavAssets,
  getAllUserFavCatalogs,
  getUserAssets
} from '@/Lib/users/users.action';

interface IUserDetailCards {
  showCategory: string;
  subCategory: string;
  search: string;
}

const breakpointColumnsObj = {
  default: 3,
  1200: 2,
  915: 1,
};


const UserDetailCards: React.FC<IUserDetailCards> = (props) => {
  const { showCategory, subCategory = '', search } = props;
  const params = useParams();
  const dispatch = useAppDispatch();

  const {
    usersData: {
      userCreatedAssets, userCollectedAssets, userCatalogs, userFavAssets, userFavCatalogs, userPlacedOffers,
      userReceivedOffers, userPlacedBids, userReceivedBids, userProfileDrafts
    }
  } = useAppSelector(getAllUsersSelector);

  const renderCards = () => {
    switch (true) {
      case showCategory === 'Assets' && subCategory === 'Created':
        return userCreatedAssets?.assets?.map((item: any) => <AssetCard key={item.id} item={item} />);
      
      case showCategory === 'Assets' && subCategory === 'Collected':
        return userCollectedAssets?.assets?.map((item: any) => <AssetCard key={item.id} item={item} />);

      case showCategory === 'Catalogs':
        return userCatalogs?.catalogs?.map((item: any) => <CatalogCard key={item.id} cardData={item} />);
        
      case showCategory === 'Favorites' && subCategory === 'Assets':
        return userFavAssets?.assets?.map((item: any) => <AssetCard key={item.id} item={item} />);
      
      case showCategory === 'Favorites' && subCategory === 'Catalogs':
        return userFavCatalogs?.catalogs?.map((item: any) => <CatalogCard key={item.id} cardData={item} />);
      
      case showCategory === 'Offers' && subCategory === 'Offers placed':
        return userPlacedOffers?.assets?.map((item: any) => <AssetCard key={item.id} item={offersObjHandler(item)} />);
      
      case showCategory === 'Offers' && subCategory === 'Offers received':
        return userReceivedOffers?.assets?.map((item: any) => <AssetCard key={item.id} item={offersObjHandler(item)} offerCard/>);
      
      case showCategory === 'Bids' && subCategory === 'Bids placed':
        return userPlacedBids?.assets?.map((item: any) => <AssetCard key={item.id} item={bidsObjHandler(item)} isBids />);
  
      case showCategory === 'Bids' && subCategory === 'Bids received':
        return userReceivedBids?.assets?.map((item: any) => <AssetCard key={item.id} item={bidsObjHandler(item)} />);
      
      case showCategory === 'My Drafts':
        return userProfileDrafts?.assets?.map((item: any) => <AssetCard key={item.id} isDraft
          item={{ ...item, assetMediaUrl: item.assetMedia || item.assetMediaUrl }} />);
      
      default:
        return null;
    }
  };

  const fetchMoreData = () => {
    if (showCategory === 'Assets' && subCategory === 'Created') {
      dispatch(
        getUserAssets({
          creatorId: `${params?.userId}`,
          latestPage:
            Number(userCreatedAssets?.latestPage) + 1,
          loadMore: true,
          filters: { search: search }
        }),
      );
    } else if (showCategory === 'Assets' && subCategory === 'Collected') {
      dispatch(
        getUserAssets({
          ownerId: `${params?.userId}`,
          latestPage: Number(userCollectedAssets?.latestPage) + 1,
          loadMore: true,
          filters: { search: search }
        }),
      );
    } else if (showCategory === 'Favorites' && subCategory === 'Assets') {
      dispatch(
        getAllUserFavAssets({
          userId: `${params?.userId}`,
          latestPage: Number(userFavAssets?.latestPage) + 1,
          loadMore: true,
          filters: { search: search }
        }),
      );
    } else if (showCategory === 'Favorites' && subCategory === 'Catalogs') {
      dispatch(
        getAllUserFavCatalogs({
          userId: `${params?.userId}`,
          latestPage: Number(userFavCatalogs?.latestPage) + 1,
          loadMore: true,
          filters: { search: search }
        }),
      );
    } else if (showCategory === 'Offers' && subCategory === 'Offers placed') {
      dispatch(
        getAllPlacedOffers({
          latestPage: Number(userPlacedOffers?.latestPage) + 1,
          loadMore: true,
        }),
      );
    } else if (showCategory === 'Offers' && subCategory === 'Offers received') {
      dispatch(
        getAllReceivedOffers({
          latestPage: Number(userReceivedOffers?.latestPage) + 1,
          loadMore: true,
        }),
      );
    } else if (showCategory === 'Bids' && subCategory === 'Bids placed') {
      dispatch(
        getAllPlacedBids({
          latestPage: Number(userPlacedBids?.latestPage) + 1,
          loadMore: true,
        }),
      );
    } else if (showCategory === 'Bids' && subCategory === 'Bids received') {
      dispatch(
        getAllReceivedBids({
          latestPage: Number(userReceivedBids?.latestPage) + 1,
          loadMore: true,
        }),
      );
    } else if (showCategory === 'My Drafts') {
      dispatch(
        getAllMyDrafts({
          latestPage:
            Number(userProfileDrafts?.latestPage) + 1,
          loadMore: true,
        }),
      );
    } else if (showCategory === 'Catalogs') {
      dispatch(
        getAllUserCatalogs({
          userId: `${params?.userId}`,
          latestPage:
            Number(userCatalogs.latestPage) + 1,
          loadMore: true,
          filters: { search: search }
        }),
      );
    }
  };

  const getDataLengthAndHasMore = () => {
    if (showCategory === 'Assets' && subCategory === 'Created') {
      return {
        dataLength: userCreatedAssets?.assets?.length || 0,
        hasMore: userCreatedAssets?.hasMore,
      };
    } else if (showCategory === 'Assets' && subCategory === 'Collected') {
      return {
        dataLength: userCollectedAssets?.assets?.length || 0,
        hasMore: userCollectedAssets?.hasMore,
      };
    } else if (showCategory === 'Favorites' && subCategory === 'Assets') {
      return {
        dataLength: userFavAssets?.assets?.length || 0,
        hasMore: userFavAssets?.hasMore,
      };
    } else if (showCategory === 'Favorites' && subCategory === 'Catalogs') {
      return {
        dataLength: userFavCatalogs?.catalogs?.length || 0,
        hasMore: userFavCatalogs?.hasMore,
      };
    } else if (showCategory === 'Offers' && subCategory === 'Offers placed') {
      return {
        dataLength: userPlacedOffers?.assets?.length || 0,
        hasMore: userPlacedOffers?.hasMore,
      };
    } else if (showCategory === 'Offers' && subCategory === 'Offers received') {
      return {
        dataLength: userReceivedOffers?.assets?.length || 0,
        hasMore: userReceivedOffers?.hasMore,
      };
    } else if (showCategory === 'Bids' && subCategory === 'Bids placed') {
      return {
        dataLength: userPlacedBids?.assets?.length || 0,
        hasMore: userPlacedBids?.hasMore,
      };
    } else if (showCategory === 'Bids' && subCategory === 'Bids received') {
      return {
        dataLength: userReceivedBids?.assets?.length || 0,
        hasMore: userReceivedBids?.hasMore,
      };
    } else if (showCategory === 'My Drafts') {
      return {
        dataLength: userProfileDrafts?.assets?.length || 0,
        hasMore: userProfileDrafts?.hasMore,
      };
    }
    switch (showCategory) {
      case 'Catalogs':
        return {
          dataLength: userCatalogs?.catalogs?.length || 0,
          hasMore: userCatalogs?.hasMore,
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
    (showCategory === 'Assets' && subCategory === 'Created' && !userCreatedAssets?.assets?.length) ||
    (showCategory === 'Assets' && subCategory === 'Collected' && !userCollectedAssets?.assets?.length) ||
    (showCategory === 'Catalogs' && !userCatalogs?.catalogs?.length) ||
    (showCategory === 'Favorites' && subCategory === 'Assets' && !userFavAssets?.assets?.length) ||
    (showCategory === 'Favorites' && subCategory === 'Catalogs' && !userFavCatalogs?.catalogs?.length) ||
    (showCategory === 'Offers' && subCategory === 'Offers placed' && !userPlacedOffers?.assets?.length) ||
    (showCategory === 'Offers' && subCategory === 'Offers received' && !userReceivedOffers?.assets?.length) ||
    (showCategory === 'My Drafts' && !userProfileDrafts?.assets?.length)
  ) {
    return (<div className="d-flex align-items-center justify-content-center mt-5">
              <div style={{ fontSize: '48px', color: '#ddd' }}>No data found</div>
            </div>);
  } else if (
    (showCategory === 'Bids' && subCategory === 'Bids placed' && !userPlacedBids?.assets?.length) ||
    (showCategory === 'Bids' && subCategory === 'Bids received' && !userReceivedBids?.assets?.length)
  ) { return <NoBidsData msg={`No ${subCategory}`} /> }

  if (['Orders', 'History'].includes(showCategory)) {
    return (
      <div className={`user-details-card ${showCategory === 'Orders' ? 'order-vh' : ''}`}>
        <ProfileDropdownComponent dropDown={showCategory} />
      </div>
    );
  }

  return (
    <div className="user-details-card" id="scrollable-div">
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<></>}
        scrollableTarget="scrollable-div">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={`my-masonry-grid masonry-wrapper`}
          columnClassName="my-masonry-grid_column"
        >
          {renderCards()}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
};

export default UserDetailCards;
