import React, { useEffect, useMemo, useState } from 'react';
import Waveform from './WaveForm';
import { EditIcon, MusicSVG, PauseSVG, PlaySVG, VerifiedSign } from '@/Assets/svg';
import './audiocard.scss';
import ErrorBoundary from '@/Components/AssetCard/errorBoundary';
import { CardType, cardTypeEnum, getCardType, } from '@/Components/AssetCard/helperMethod';
import CommonFavouriteBtn from '../CommonFavouriteBtn';
import CardFooter from '@/Components/AssetCard/cardFooter';
import EditBidModal from '@/Components/EditBidModal';
import OfferCardBtn from '../OfferCardBtn';
import ImageWithFallback from '@/Components/AssetCard/imageWithFallback';
import AuctionTimer from '@/Components/AuctionTimer';
import { useParams } from 'next/navigation';

interface IAudioCardsSection {
  item: any;
  loading?: boolean;
  handleViewAssets: (id: string) => void;
  offerCard: boolean;
  isDraft: boolean;
  isBids: boolean;
}

const AudioCardsSection: React.FC<IAudioCardsSection> = (props) => {
  const { item, handleViewAssets, offerCard, isBids, isDraft } = props;
  const { id, assetMediaUrl, orderType } = item;

  const params = useParams();

  const [waveFormInstance, setWaveformInstance] = useState<any>(null);
  const [renderPlayer, toggleRenderPlayer] = useState<boolean>(false);
  const [editBidModal, toggleEditBidModal] = useState<boolean>(false);
  const [duration, setDuration] = useState<any>(0);

  const onTimeUpdate = () => {
    if (waveFormInstance.isPlaying()) {
      var currentTime = waveFormInstance.getCurrentTime(),
        totalTime = waveFormInstance.getDuration(),
        remainingTime = totalTime - currentTime;
      setDuration(remainingTime);
    }
  };

  const cardType: CardType = useMemo(() => {
    return getCardType(item);
  }, [item]);

  const onPlay = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    waveFormInstance.play();
    waveFormInstance.on('audioprocess', onTimeUpdate);
    toggleRenderPlayer(true);
  };

  useEffect(() => {
    if(duration?.toFixed() == 0) {
      toggleRenderPlayer(false)
    }
  }, [duration])

  const onPause = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    waveFormInstance.pause();
    toggleRenderPlayer(false);
  };

  const onEditBid = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    toggleEditBidModal(!editBidModal);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      <ErrorBoundary>
        <div className="audio-card" id={id} onMouseLeave={onPause}>
          <ImageWithFallback
            className="audio-asset-image"
            src={item.assetThumbnail_resized || item.assetThumbnail}
            layout="responsive"
            objectFit="cover"
            height={100}
            width={100}
            alt=""
            assetDetails={item}
          />
          <div className="audio-left-icon-wrapper">
            <MusicSVG />
          </div>
          {orderType ==='fixed' && !isDraft && <div className="on-sale-absolute">
            On Sale
          </div>}
          <div className="audio-blur-overlay">
            <div className="overlay-card">
              <div className="audio-header">
                <div className="image-icon">
                  <MusicSVG />
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
                 /> )}
                {!isDraft && <CommonFavouriteBtn
                  assetId={id}
                  isFavourite={item?.isFavourite}
                />}
              </div>
              {item.physicalAsset &&
                (cardType === cardTypeEnum.SINGLE_BID ||
                  cardType === cardTypeEnum.MULTIPLE_BID) && (
                  <div className="physical-asset-badge">Physical Asset</div>
                )}
              <div className="audio-section">
                {renderPlayer ? (
                  <>
                    <source src={assetMediaUrl} type="audio/mp3" />
                    <div className="pause-audio" onClick={onPause}>
                      <div>
                        <PauseSVG />
                      </div>
                    </div>
                  </>
                ) : (
                  <div onClick={onPlay}>
                    <PlaySVG />
                  </div>
                )}
                <Waveform
                  setWaveformInstance={setWaveformInstance}
                  audioUrl={assetMediaUrl}
                />
                <span>{formatTime(duration)}</span>
              </div>
              <div className={`details-section ${offerCard ? 'offer-card' : ''}`}>
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
                  </h4>
                </div>
              </div>
              {!offerCard && <div className="assets-audio-footer">
                <CardFooter
                  cardType={cardType}
                  onClick={handleViewAssets}
                  item={item}
                  isBids={isBids}
                  isDraft={isDraft}
                />
              </div>}
              {offerCard && <OfferCardBtn item={item} />}
            </div>
          </div>
        </div>
      </ErrorBoundary>
      {
        editBidModal && (
          <EditBidModal show onHide={onEditBid} assetId={item.id || ''} />
        )
      }
    </>
  );
};
export default AudioCardsSection;
