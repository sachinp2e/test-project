import React, { useMemo, useState } from 'react';
import RightArrow from '../../../Assets/_images/arrow-circle-right.svg';
import { EditIcon, FileIcon, VerifiedSign } from '@/Assets/svg';
import './filecard.scss';
import noImage from '@/Assets/_images/no-image.jpg'
import ErrorBoundary from '@/Components/AssetCard/errorBoundary';
import CommonFavouriteBtn from '../CommonFavouriteBtn';
import ImageWithFallback from '@/Components/AssetCard/imageWithFallback';
import OfferCardBtn from '../OfferCardBtn';
import CardFooter from '../cardFooter';
import { CardType, cardTypeEnum, getCardType } from '../helperMethod';
import AuctionTimer from '@/Components/AuctionTimer';
import { useParams } from 'next/navigation';
import EditBidModal from '@/Components/EditBidModal';
import { isValidFileType } from '@/utils/helperMethods';
import CustomOfferModel from '@/Components/CustomOfferModel';

interface IFileCardSection {
  item: any;
  loading?: boolean;
  offerCard: boolean;
  isDraft: boolean;
  isBids: boolean;
  handleViewAssets: (id: string) => void;
}

const FileCardSection: React.FC<IFileCardSection> = (props) => {
  const { item, handleViewAssets, isDraft, offerCard, isBids } = props;
  const {
    id,
    assetMediaUrl_resized,
    assetMediaUrl,
    orderType,
    assetThumbnail_resized,
    assetThumbnail
  } = item || {};

  const params = useParams();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editBidModal, toggleEditBidModal] = useState<boolean>(false);

  const cardType: CardType = useMemo(() => {
    return getCardType(item);
  }, [item]);

  const onEditBid = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    toggleEditBidModal(!editBidModal);
  };

  const showResizedImage = isValidFileType(
    (assetMediaUrl_resized || '').toLowerCase(),
    'image',
  );

  return (
    <>
      <ErrorBoundary>
        <div className="file-card" id={id}>
          <ImageWithFallback
            className="asset-image"
            src={showResizedImage ? assetMediaUrl_resized : assetMediaUrl || assetThumbnail_resized || assetThumbnail || noImage}
            assetDetails={item}
            width={1000}
            height={1000}
            alt=""
          />
          <div className="file-icon-absolute">
            <FileIcon />
          </div>
          {orderType === 'fixed' && !isDraft && <div className="on-sale-absolute">On Sale</div>}
          <div className="file-blur-overlay">
            <div className="overlay-card">
              <div className="header">
                <div className="file-icon">
                  <FileIcon />
                </div>
                {cardType === cardTypeEnum.SINGLE_BID ||
                cardType === cardTypeEnum.MULTIPLE_BID ? (
                  <div className="bidding-time-wrapper">
                    <div className="bidding-date">
                      {item?.orderType === 'timed' && (
                        <AuctionTimer
                          bidStartDate={item?.bidStartDate}
                          bidEndDate={item?.bidEndDate}
                          card={true}
                        />
                      )}
                    </div>
                  </div>
                ) : item.physicalAsset ? (
                  <div className="physical-asset-badge">Physical Asset</div>
                ) : null}
                {item?.offerStatus === 'hold' && (
                   <AuctionTimer
                   bidStartDate={item?.offerStart}
                   bidEndDate={item?.offerExpiry}
                   card={true}
                 />
               )}
                {!isDraft && <div className="file-right-wrapper">
                  <CommonFavouriteBtn
                    assetId={id}
                    isFavourite={item?.isFavourite}
                  />
                </div>}
              </div>
              {item.physicalAsset &&
                (cardType === cardTypeEnum.SINGLE_BID ||
                  cardType === cardTypeEnum.MULTIPLE_BID) && (
                  <div className="physical-asset-badge">Physical Asset</div>
                )}
              <div
                className={`asset-description ${offerCard ? 'offer-card' : ''}`}
              >
                <div>
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
                <p className="asset-price">
                  {cardType === cardTypeEnum.SINGLE_BID ||
                  cardType === cardTypeEnum.MULTIPLE_BID
                    ? params?.userId
                      ? 'Bid Price:'
                      : 'Highest Bid:'
                    : cardType === cardTypeEnum.SINGLE_SALE ||
                        cardType === cardTypeEnum.MULTIPLE_SALE
                      ? 'Price:'
                      : 'Highest Offer:'}{' '}
                  <b className="ms-2">
                    $
                    {cardType === cardTypeEnum.SINGLE_BID ||
                    cardType === cardTypeEnum.MULTIPLE_BID
                      ? item?.highestBid || item.bidAmount || '0'
                      : cardType === cardTypeEnum.SINGLE_SALE ||
                          cardType === cardTypeEnum.MULTIPLE_SALE
                        ? item?.price || '0'
                        : item?.offerAmount || item?.highestOffer || '0'}
                  </b>
                  {(cardType === cardTypeEnum.SINGLE_BID ||
                    cardType === cardTypeEnum.MULTIPLE_BID) &&
                    isBids && (
                      <span className="ms-2" onClick={onEditBid}>
                        <EditIcon height="22" width="22" />
                      </span>
                    )}
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
      {editBidModal && (
        <EditBidModal show onHide={onEditBid} assetId={item.id || ''} />
      )}
      {modalOpen && (
        <CustomOfferModel
          show={modalOpen}
          onHide={() => setModalOpen(modalOpen)}
          title="Please get KYC verified first"
          discription="KYC is necessary to access all features of the platform."
          text="Let’s get started"
          image={RightArrow}
          skip="skip"
          handleClick={() => setModalOpen(false)}
          navigatelogin={false}
        />
      )}
    </>
  );
};
export default FileCardSection;
