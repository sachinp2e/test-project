import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  EditIcon,
  LikeSVG,
  PauseSVG,
  UnlikeSVG,
  VerifiedSign,
  VideoPlaySVG,
  VideoSVG,
} from '@/Assets/svg';
import './videocard.scss';
import dayjs from 'dayjs';
import useEffectOnce from '@/Hooks/useEffectOnce';
import {
  CardType,
  cardTypeEnum,
  getCardType,
} from '@/Components/AssetCard/helperMethod';
import { isValidFileType } from '@/utils/helperMethods';
import { authSelector } from '@/Lib/auth/auth.selector';
import { useAppSelector } from '@/Lib/hooks';
import ErrorBoundary from '@/Components/AssetCard/errorBoundary';
import CommonFavouriteBtn from '../CommonFavouriteBtn';
import CardFooter from '@/Components/AssetCard/cardFooter';
import EditBidModal from '@/Components/EditBidModal';
import OfferCardBtn from '../OfferCardBtn';
import ImageWithFallback from '@/Components/AssetCard/imageWithFallback';
import AuctionTimer from '@/Components/AuctionTimer';
import { useParams } from 'next/navigation';

interface IVodeosCardsSection {
  item: any;
  loading?: boolean;
  handleViewAssets: (id: string) => void;
  offerCard: boolean;
  isDraft: boolean;
  isBids: boolean;
}

const VideoCardComponent: React.FC<IVodeosCardsSection> = (props) => {
  const { item, handleViewAssets, offerCard, isDraft, isBids } = props;
  const { id, assetMediaUrl, assetThumbnail, assetThumbnail_resized, ownerId, orderType } =
    item;

  const params = useParams();

  const [renderPlayer, toggleRenderPlayer] = useState<boolean>(false);
  const [editBidModal, toggleEditBidModal] = useState<boolean>(false);

  const cardType: CardType = useMemo(() => {
    return getCardType(item);
  }, [item]);

  const onTogglePlaying = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleRenderPlayer(!renderPlayer);
  };

  const showResizedImage = isValidFileType(
    (assetThumbnail_resized || '').toLowerCase(),
    'image',
  );

  const onEditBid = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    toggleEditBidModal(!editBidModal);
  };

  return (
    <>
      <ErrorBoundary>
        <div className="video-card" id={id}>
          <ImageWithFallback
            className="asset-image"
            src={showResizedImage ? assetThumbnail_resized : assetThumbnail}
            layout="responsive"
            objectFit="cover"
            height={100}
            width={100}
            alt=""
            assetDetails={item}
          />
          <div className="image-icon-absolute">
            <VideoSVG />
          </div>
          {orderType === 'fixed' && <div className="on-sale-absolute">
            On Sale
          </div>}
          <div className="video-blur-overlay">
            <div className="overlay-card">
              <div className="header">
                <div className="image-icon">
                  <VideoSVG />
                </div>
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
                <CommonFavouriteBtn
                  assetId={id}
                  isFavourite={item?.isFavourite}
                />
              </div>
              {item.physicalAsset &&
                (cardType === cardTypeEnum.SINGLE_BID ||
                  cardType === cardTypeEnum.MULTIPLE_BID) && (
                  <div className="physical-asset-badge">Physical Asset</div>
                )}
              <div className="video-section">
                {renderPlayer ? (
                  <video
                    autoPlay
                    controls
                    disablePictureInPicture
                    controlsList="nodownload noplaybackrate disablePictureInPicture"
                  >
                    <source src={assetMediaUrl} type="video/mp4" />
                    <div className="pause-video" onClick={onTogglePlaying}>
                      <PauseSVG />
                    </div>
                  </video>
                ) : (
                  <div onClick={onTogglePlaying}>
                    <VideoPlaySVG />
                  </div>
                )}
              </div>
              <div className={`details-section ${offerCard ? 'offer-card': ''}`}>
                <div className="left-section">
                  <p className="catalogue-name">{item?.catalogue?.name}</p>
                  <p className="asset-name">
                    {item?.name}
                    {item.isLegallyVerified && (
                      <span className="px-2">
                        <VerifiedSign height="24" width="24" />
                      </span>
                    )}
                  </p>
                </div>
                <div className="right-section">
                  <p>
                    {cardType === cardTypeEnum.SINGLE_BID ||
                    cardType === cardTypeEnum.MULTIPLE_BID
                      ? params?.userId ? 'Bid Price:' : 'Highest Bid:'
                      : cardType === cardTypeEnum.SINGLE_SALE ||
                          cardType === cardTypeEnum.MULTIPLE_SALE
                        ? 'Price:'
                        : 'Highest Offer:'}
                  </p>
                  <h4>
                    ${item.price ?? item.highestBid ?? 0}
                    {(cardType === cardTypeEnum.SINGLE_BID ||
                      cardType === cardTypeEnum.MULTIPLE_BID) &&
                      isBids && (
                        <span className="ms-2" onClick={onEditBid}>
                          <EditIcon height="22" width="22" />
                        </span>
                      )}
                  </h4>
                </div>
              </div>
              {!offerCard && <div className="footer">
                <CardFooter
                  item={item}
                  cardType={cardType}
                  isDraft={isDraft}
                  isBids={isBids}
                  onClick={handleViewAssets}
                />
              </div>}
              {offerCard && <OfferCardBtn item={item} />}
            </div>
          </div>
        </div>
      </ErrorBoundary>
      {editBidModal && (
        <EditBidModal show onHide={onEditBid} assetId={item.id || ''} />
      )}
    </>
  );
};
export default VideoCardComponent;
