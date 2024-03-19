import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import catalogs from '@/Assets/_images/explore-catalog-img3.png';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { AssetDetailSelector } from '@/Lib/assetDetail/assetDetail.selector';
import HistoryCard from './HistoryCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosInstance from '@/Lib/axios';
import { ContentCard } from './ContentCard';
import {
  getAssetCountListing,
  getAssetCountOffers,
} from '@/Lib/assetDetail/assetDetail.action';
import NodataMsg from '../../../Assets/_images/EmptyState.png';
import Image from 'next/image';
interface ITabsContent {
  selectedTab: string;
}

const TabsContent = ({ selectedTab }: ITabsContent) => {
  const {
    AssetDetails,
    assetListing: { data },
    assetOffersListing,
  } = useAppSelector(AssetDetailSelector);
  const dispatch = useAppDispatch();
  const [assetHistory, setAssetHistory] = useState<any>({
    data: [],
    pagination: {},
  });

  const isUnminTedCopiesAvailable = useMemo(
    () => !!AssetDetails?.availableSupply,
    [AssetDetails],
  );

  const fetchAssetHistory = async () => {
    try {
      const { data: responseData } = await axiosInstance.get('/activity',
        {
          params: {
            // query: 'history',
            page: Number(assetHistory.pagination.page || 0) + 1,
            limit: 7,
            assetId: AssetDetails?.id,
          },
        },
      );
      setAssetHistory((prevState: any) => ({
        data:
          responseData?.result?.pagination.page === 1
            ? responseData?.result.data
            : [...prevState.data, ...responseData?.result?.data],
        pagination: responseData.result.pagination,
      }));
    } catch (error) {
      console.error('Error fetching asset history:', error);
    }
  };

  useEffect(() => {
    if (selectedTab === 'Listing') {
      dispatch(getAssetCountListing(AssetDetails?.id));
    }
    if (selectedTab === 'Open for Offers') {
      dispatch(getAssetCountOffers(AssetDetails?.id));
    }
    if (selectedTab === 'History') {
      fetchAssetHistory();
    }
  }, [selectedTab]);

  return (
    <>
      {selectedTab === 'Listing' && (
        <>
          {isUnminTedCopiesAvailable && AssetDetails?.onSaleSupply > 0 && (
            <ContentCard
              img={catalogs}
              title={
                <span>
                  {AssetDetails?.onSaleSupply}/{AssetDetails?.totalSupply} on
                  sale by{' '}
                  <Link href="">
                    <b>{AssetDetails?.creator?.userName}</b>
                  </Link>
                </span>
              }
              price={`Price: $${AssetDetails?.price} for each`}
              listings
              isUnminTedCopiesAvailable={isUnminTedCopiesAvailable}
              showCreatorPutOnSale
              userSaleCopiesAvailable={AssetDetails?.onSaleSupply}
            />
          )}
          {data?.length > 0 &&
            data.map((item: any, idx: number) => {
              return (
                <ContentCard
                  key={`listings_${idx}`}
                  img={catalogs}
                  title={
                    <span>
                      {item?.onSaleAssetCount}/{item?.totalCopies} on sale by{' '}
                      <Link href="">
                        <b>{item?.owner_userName}</b>
                      </Link>
                    </span>
                  }
                  price={`Price: $${AssetDetails?.price} for each`}
                  listings
                  userSaleCopiesAvailable={item?.onSaleAssetCount}
                  item={item}
                />
              );
            })}
        </>
      )}
      {selectedTab === 'Open for Offers' && (
        <>
          {isUnminTedCopiesAvailable &&  (AssetDetails?.availableSupply - AssetDetails?.onSaleSupply) > 0 && (
            <ContentCard
              img={catalogs}
              title={<b>{AssetDetails?.creator?.userName}</b>}
              price={`${
                AssetDetails?.availableSupply - AssetDetails?.onSaleSupply
              } copy not for sale`}
              offers
              isUnminTedCopiesAvailable={isUnminTedCopiesAvailable}
              showCreatorPutOnSale
            />
          )}
          {assetOffersListing?.data?.length > 0 &&
            assetOffersListing.data.map((item: any, idx: number) => (
              <ContentCard
                key={`offers_listing_${idx}`}
                img={catalogs}
                title={<b>{item?.owner_userName}</b>}
                price={`${item?.offSaleAssetCount} copy not for sale`}
                offers
                item={item}
              />
            ))}
        </>
      )}
      {selectedTab === 'History' &&
        (assetHistory?.data?.length ? (
          <InfiniteScroll
            dataLength={assetHistory.data.length}
            next={fetchAssetHistory}
            hasMore={
              assetHistory.data.length <
              Number(assetHistory.pagination.totalCount)
            }
            loader={<>Loading..!!</>}
            scrollThreshold={1}
            scrollableTarget="history-container-scrollable-div"
          >
            {assetHistory.data.map((element: any, idx: number) => (
              <HistoryCard key={`history_${idx}`} elem={element} />
            ))}
          </InfiniteScroll>
        ) : (
          <div className='container-div'>
            <Image
              src={NodataMsg}
              alt="avatar"
              quality={100}
              width={200}
              height={200}
            />
          <p className="text-center fs-2 mt-5">No History Found </p>
          </div>
        ))}
    </>
  );
};

export default TabsContent;
