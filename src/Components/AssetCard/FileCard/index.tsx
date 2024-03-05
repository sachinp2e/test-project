import React, { useMemo } from 'react';
import Image from 'next/image';
import StarIcon from '../../../Assets/_images/star-icone.svg';
import { EditIcon, FileIcon, VerifiedSign } from '@/Assets/svg';
import './filecard.scss';
import ErrorBoundary from '@/Components/AssetCard/errorBoundary';
import CommonFavouriteBtn from '../CommonFavouriteBtn';
import ImageWithFallback from '@/Components/AssetCard/imageWithFallback';
import OfferCardBtn from '../OfferCardBtn';
import CardFooter from '../cardFooter';
import { CardType, cardTypeEnum, getCardType } from '../helperMethod';
import AuctionTimer from '@/Components/AuctionTimer';
import { useParams } from 'next/navigation';

interface IFileCardSection {
  item: any;
  loading?: boolean;
  offerCard: boolean;
  isDraft: boolean;
  isBids: boolean;
  handleViewAssets: (id: string) => void;
}

const FileCardSection: React.FC<IFileCardSection> = (props) => {
  const { item, loading, handleViewAssets, isDraft, offerCard, isBids } = props;
  const { id, orderType, price, assetMediaUrl, assetThumbnail } = item || {};

  const params = useParams();

  const cardType: CardType = useMemo(() => {
    return getCardType(item);
  }, [item]);

  return (
    <ErrorBoundary>
      <div className="file-cards-main-wrapper" key={id}>
        {/*<Image*/}
        {/*  className="file-main-image"*/}
        {/*  src={assetThumbnail}*/}
        {/*  width={1000}*/}
        {/*  height={1000}*/}
        {/*  alt=""*/}
        {/*/>*/}
        <ImageWithFallback
          className="file-main-image"
          src={assetThumbnail}
          width={1000}
          height={1000}
          alt=""
          assetDetails={item}
        />
        <div className="file-left-wrapper">
          <FileIcon />
        </div>
        {orderType === 'fixed' ? (
          <div className="file-right-wrapper">
            <div className="sale-file-right-wrapper">
              <span>On Sale</span>
            </div>
          </div>
        ) : null}
        <div className="file-blur-overlay">
          {cardType === cardTypeEnum.SINGLE_BID ||
          cardType === cardTypeEnum.MULTIPLE_BID ? (
            <div className="bidding-time-wrapper">
              <p className="bidding-date">
                {item?.orderType === 'timed' && (
                  <AuctionTimer
                    bidStartDate={item?.bidStartDate}
                    bidEndDate={item?.bidEndDate}
                    card={true}
                  />
                )}
              </p>
            </div>
          ) : item.physicalAsset ? (
            <div className="physical-asset-badge">Physical Asset</div>
          ) : null}
          {item?.offerStatus === 'hold' && (
                   <AuctionTimer
                   bidStartDate={item?.offerStart}
                   bidEndDate={item?.offerExpiry}
                   card={true}/> )}
          <div className="file-right-wrapper">
            <CommonFavouriteBtn assetId={id} isFavourite={item?.isFavourite} />
          </div>
          <div className="file-text-blur-overlay">
            <div className="file-details">
              <div className="file-title">
                <span>{item?.catalogue?.name}</span>
              </div>
              <div className="file-sub-title">
                <span>{item?.name}</span>
                {(item.isLegallyVerified) && (
                  <span className="">
                    <VerifiedSign height="24" width="24" />
                  </span>
                )}
              </div>
              <p className="file-price">
                {cardType === cardTypeEnum.SINGLE_BID ||
                cardType === cardTypeEnum.MULTIPLE_BID
                  ? params?.userId ? 'Bid Price:' : 'Highest Bid:'
                  : cardType === cardTypeEnum.SINGLE_SALE ||
                  cardType === cardTypeEnum.MULTIPLE_SALE
                    ? 'Price:'
                    : 'Highest Offer:'}{' '}
                <b className="ms-2">
                  $
                  {cardType === cardTypeEnum.SINGLE_BID ||
                  cardType === cardTypeEnum.MULTIPLE_BID
                    ? (item?.highestBid || item.bidAmount || '0')
                    : cardType === cardTypeEnum.SINGLE_SALE ||
                    cardType === cardTypeEnum.MULTIPLE_SALE
                      ? item?.price || '0'
                      : item?.offerAmount || item?.highestOffer || '0'}
                </b>
              </p>
            </div>
            {!offerCard && (
              <div className="footer">
                <CardFooter
                  onClick={handleViewAssets}
                  item={item}
                  isDraft={isDraft}
                  isBids={isBids}
                  cardType={cardType}
                />
              </div>
            )}
          </div>
          {offerCard && <OfferCardBtn item={item} />}
        </div>
      </div>
    </ErrorBoundary>
  );
};
export default FileCardSection;
