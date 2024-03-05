import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Button from '../../Button';
import ArrowBtnImg from '../../../Assets/_images/arrow-circle-right.svg';
import StarIcon from '../../../Assets/_images/star-icone.svg';
import {
  EditIcon,
  LikeSVG,
  ThreeDimensional,
  UnlikeSVG,
  VerifiedSign,
} from '@/Assets/svg';
import './threedimensionalcard.scss';
import Model from '@/Components/model/model';
import ErrorBoundary from '@/Components/AssetCard/errorBoundary';
import { authSelector } from '@/Lib/auth/auth.selector';
import { useAppSelector } from '@/Lib/hooks';
import CommonFavouriteBtn from '../CommonFavouriteBtn';
import { isValidFileType } from '@/utils/helperMethods';
import {
  CardType,
  cardTypeEnum,
  getCardType,
} from '@/Components/AssetCard/helperMethod';
import dayjs from 'dayjs';
import useEffectOnce from '@/Hooks/useEffectOnce';
import threedimsionalimage from '@/Assets/_images/threeDimisionaliamge.svg';
import EditBidModal from '@/Components/EditBidModal';
import CardFooter from '../cardFooter';
import OfferCardBtn from '../OfferCardBtn';
import ImageWithFallback from '../imageWithFallback';
import AuctionTimer from '@/Components/AuctionTimer';
import { useParams } from 'next/navigation';

interface IThreeDimensionalSection {
  item?: any;
  loading?: boolean;
  handleViewAssets: (id: string) => void;
  offerCard: boolean;
  isDraft: boolean;
  isBids: boolean;
}

const ThreeDimensionalSection: React.FC<IThreeDimensionalSection> = (props) => {
  const { item, handleViewAssets, offerCard, isDraft, isBids } = props;
  const { id, assetThumbnail, assetThumbnail_resized, orderType } = item;

  const params = useParams();

  const [editBidModal, toggleEditBidModal] = useState<boolean>(false);

  const cardType: CardType = useMemo(() => {
    return getCardType(item);
  }, [item]);

  const showResizedImage = isValidFileType(
    (assetThumbnail_resized || '').toLowerCase(),
    'image',
  );
  const onEditBid = () => {
    toggleEditBidModal(!editBidModal);
  };

  return (
      <>
      <ErrorBoundary>
        <div className="three-dimensional-main-wrapper" key={id} id={id}>
        <ImageWithFallback
            className="audio-asset-image"
            src={
              showResizedImage
                ? assetThumbnail_resized
                : assetThumbnail || threedimsionalimage
            }
            layout="responsive"
            objectFit="cover"
            height={100}
            width={100}
            alt=""
            assetDetails={item}
          />
          {/* <Model modelUrl={assetMediaUrl} /> */}
          <div className="three-dimensional-left-wrapper">
            <ThreeDimensional />
          </div>
          {orderType ==='fixed' && <div className="on-sale-absolute">
            On Sale
          </div>}
          <div className="three-dimensional-blur-overlay">
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
            <div className="three-dimensional-right-wrapper">
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
            <div className="three-dimensional-text-blur-overlay">
              <div className="details-section">
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
                    ${item.price ?? 0 ?? item.highestBid}
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
              {!offerCard && (
                <div className="threeD-footer">
                  <CardFooter
                    item={item}
                    cardType={cardType}
                    isDraft={isDraft}
                    isBids={isBids}
                    onClick={handleViewAssets}
                  />
                </div>
              )}
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

export default ThreeDimensionalSection;
