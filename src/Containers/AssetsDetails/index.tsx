'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import MakeOffer from './makeOffer';
import BidNow from './Bid';
import Report from './report';
import FavouiteModal from './Favourite';
import GenericModal from '@/Components/modal';
import TopCatalogs from '../Landing/TopCatalogs';
import useEffectOnce from '../../Hooks/useEffectOnce';
import ToggleTab from '@/Components/ToggleTab';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { toastSuccessMessage, validFileExtensions } from '@/utils/constants';
import Skeleton from '../../Components/SkeletonLoader/index';
import { getAllAssetsSelector } from '@/Lib/assets/assets.selector';
import stamp from '@/Assets/_images/myipr-verification.svg';
import chain from '../../Assets/_images/chain.png';
import catalogs from '@/Assets/_images/catalogs.png';
import transefer from '@/Assets/_images/transefer.svg';
import {
  DownloadAssetIcon,
  HintIcon,
  ImageIconSvg,
  OverlayBack,
  PauseSVG,
  Vector2SVG,
  VideoPlaySVG,
} from '@/Assets/svg';
import { ThreeDimensional } from '@/Assets/svg';
import transferSvg from '@/Assets/_images/transefer.svg';
import Model from '../../Components/model/model';
import { VideoSVG } from '@/Assets/svg';
import AudioModel from '@/Components/AssetCard/AudioCard/audioModel';
import VideoModel from '@/Components/AssetCard/VideoCard/VideoModel/videoModel';
import AudioSampleThumbnailImage from '@/Assets/_images/audio-sample-thumbnail.jpeg';
import {
  Discord,
  EyeIcon,
  Facebook,
  Favourite,
  Instagram,
  LinkButton,
  Linkedin,
  LinkFile,
  MoreButton,
  Twiiter,
  VerifiedSign,
  DeleteBinIconBlack,
  ReportFlagIcon,
  DownloadIcon,
} from '@/Assets/svg';
import './asset-details.scss';
import {
  getAssetCount,
  getAssetDetails,
  getSimilarAssets,
  placeBidOnAsset,
} from '@/Lib/assetDetail/assetDetail.action';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/Lib/axios';
import { jsonStringToArrayOfObjects } from '@/utils/helperMethods';
import AssetActionComponents from './AssetActionComponents';
import DeleteModal from './DeleteModal';
import CustomFavAndUnFav from "@/Components/CustomFavourite";
import { AssetDetailSelector } from '@/Lib/assetDetail/assetDetail.selector';
import AuctionTimer from '@/Components/AuctionTimer';
import CustomCopyToClipboard from '../../Components/CopyToClipboard';
import {
  clearAssetState,
  updateAssetDetails,
} from '@/Lib/assetDetail/assetDetail.slice';
import { authSelector } from '@/Lib/auth/auth.selector';
import TabsContent from './TabsContent';
import ResultModal from '@/Components/ResultModal';

const AssetDetails = () => {
  const { id }: any = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { AssetDetails, similarAssets, assetCounts } =
    useAppSelector(AssetDetailSelector);
  const [activeTab, setActiveTab] = useState<string>('History');

  const tabs = useMemo(() => {
    if (AssetDetails?.isMultiple) {
      setActiveTab('Listing');
      return ['Listing', 'Open for Offers', 'History'];
    }
    setActiveTab('History');
    return ['History'];
  }, [AssetDetails]);

  const [modalShow, setModalShow] = useState(false);
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [showErrModal, toggleErrModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [favouriteModal, setFavouriteModal] = useState(false);
  const [bidNow, setBidNow] = useState(false);
  const [cardSelect, setCardSelect] = useState<string>('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [successModal, setSuccessModal] = useState<
    'SUCCESS' | 'FAILURE' | null
  >(null);
  const [isHoveringInfo, setIsHoveringInfo] = useState<boolean>(false);
  const [favBtn, setFavBtn] = useState<boolean>(
    AssetDetails.isFavourite || false,
  );

  const { loading } = useAppSelector(getAllAssetsSelector);
  const [renderPlayer, toggleRenderPlayer] = useState<boolean>(false);
  const { id: userId } = useAppSelector(authSelector);
  const [showAbout, setShowAbout] = useState(false);

  useEffectOnce(() => {
    dispatch(clearAssetState());
    dispatch(getAssetDetails(id))
      .then((res) => {
        if(res?.payload?.customErrorNumber === 100100){
          router.push('/404')
        }
        console.log('response',res);
      })
      .catch((err) => {
        console.log('error',err);
      });
    dispatch(getSimilarAssets(id));
  });

  useEffect(() => {
    const extension = (AssetDetails?.assetMediaUrl || '').slice(
      (AssetDetails?.assetMediaUrl || '').lastIndexOf('.') + 1,
    );
    if (validFileExtensions.image.includes(extension)) {
      setCardSelect('image');
    } else if (validFileExtensions.video.includes(extension)) {
      setCardSelect('video');
    } else if (validFileExtensions.threedimension.includes(extension)) {
      setCardSelect('threedimension');
    } else if (validFileExtensions.audio.includes(extension)) {
      setCardSelect('audio');
    } else {
      setCardSelect('pdf');
    }
    // setIsFavourite(AssetDetails?.isFavourite);
  }, [AssetDetails, validFileExtensions]);

  useEffect(() => {
    if (AssetDetails?.isMultiple) {
      dispatch(getAssetCount(id));
    }
  }, [AssetDetails]);

  const handleModalClose = () => {
    setModalShow(false);
  };
  const handleFavouriteModal = () => {
    setFavouriteModal(true);
  };
  const handleFavouriteModalClose = () => {
    setFavouriteModal(false);
  };
  const handleBidClose = () => {
    setBidNow(false);
  };
  const handleReportModal = () => {
    setReportModal(false);
  };
  const handleModalOpen = () => {
    setModalShow(true);
  };
  const handleBid = () => {
    setBidNow(true);
  };
  const handlePlaceBid = (bid: string, bidCurrency: string) => {
    if (Number(bid) > AssetDetails?.minBid) {
      const payload = {
        assetID: AssetDetails?.id,
        bidAmount: Number(bid),
        bidCurrency,
      };
      dispatch(placeBidOnAsset(payload)).then((res) => {
        if (res?.payload?.status === 200) {
          dispatch(updateAssetDetails({ highestBid: Number(bid) }));
          setSuccessModal('SUCCESS');
          handleBidClose();
        } else {
          setSuccessModal('FAILURE');
        }
      });
    }
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
      const response = await axiosInstance.post(
        '/favourite/addAndRemoveFavouriteAsset',
        {
          assetId: id,
          isFavourite: !AssetDetails.isFavourite,
        },
      );
      if (response.data.status === 200) {
        dispatch(
          updateAssetDetails({
            likes: !AssetDetails.isFavourite
              ? AssetDetails?.likes + 1
              : AssetDetails?.likes - 1,
            isFavourite: !AssetDetails.isFavourite,
          }),
        );
        setFavBtn(!AssetDetails.isFavourite);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleDeleteBtn = () => {
    toggleDeleteModal(true);
  };

  const handleDownloadAsset = async () => {
    try {
      const response = await axiosInstance.get(
        `/asset/download/${AssetDetails?.id}`,
      );
      if (response.data?.result?.assetlink) {
        // open link in new tab
        window.open(response.data?.result?.assetlink, '_blank');
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const properties = useMemo(() => {
    if (AssetDetails?.properties) {
      const propsArr = jsonStringToArrayOfObjects(AssetDetails.properties);
      if (propsArr && propsArr[0][0]) {
        return jsonStringToArrayOfObjects(AssetDetails.properties);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }, [AssetDetails]);

  const onTogglePlaying = () => {
    toggleRenderPlayer(!renderPlayer);
  };

  const handleSelectedTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleFeeInfo = () => {
    setIsHoveringInfo((prev) => !prev);
  };
  const toggleAboutDropdown = () => {
    setShowAbout((prev) => !prev);
  };

  const isOwner = useMemo(() => {
    return AssetDetails?.owner?.id === userId;
  }, [AssetDetails, userId]);

  const OnSaleCopiesAvailable = useMemo(() => {
    if (AssetDetails?.totalSupply !== AssetDetails?.availableSupply) {
      return assetCounts?.onSaleAssetCount + AssetDetails?.onSaleSupply;
    }
    return assetCounts?.onSaleAssetCount;
  }, [AssetDetails, assetCounts]);

  if (successModal) {
    return (
      <ResultModal
        onProceed={() => setSuccessModal(null)}
        text={
          successModal === 'SUCCESS'
            ? 'Bid successfully placed!'
            : 'Failed to place bid'
        }
        type={successModal}
      />
    );
  }

  return (
    <div className="asset-container">
      <div className="gradient-background"></div>
      <div className="category">
        <Link href="">{AssetDetails?.category?.name}</Link>
      </div>
      {AssetDetails?.id && (
        <div className="catalog-name">
          {AssetDetails?.catalogue?.name || 'NiftiQ Catalog'}
        </div>
      )}
      <div className="asset-name">
        <div className="assets">
          <h2>{AssetDetails?.name}</h2>
          {AssetDetails?.isLegallyVerified ||
            (AssetDetails?.assetVerificationStatus === 'completed' && (
              <VerifiedSign />
            ))}
        </div>
        <div>
          <GenericModal
            show={reportModal}
            onHide={handleReportModal}
            title="Report this Asset"
            body={<Report />}
            // body={<SuccessReport />}
            className=""
            close={true}
          />

          <div className="report">
            <div
              className="favourite"
              onClick={handleLikeUnlikeBtn}
              style={{ cursor: 'pointer' }}
            >
              <CustomFavAndUnFav favBtn={favBtn} />
            </div>
            {AssetDetails.ownerId === userId && (
              <Dropdown className="more-button-hover">
                <Dropdown.Toggle>
                  <MoreButton />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {/* <Dropdown.Item href="#/action-1">
                  <span className="report-more-icon">
                    <ReportFlagIcon />
                    Report
                  </span>
                </Dropdown.Item> */}
                  {AssetDetails.ownerId === userId && (
                    <Dropdown.Item onClick={handleDeleteBtn}>
                      <span className="report-more-icon">
                        <DeleteBinIconBlack />
                        Delete Asset
                      </span>
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={handleDownloadAsset}>
                    <span className="download-asset">
                      <DownloadIcon />
                      Download Asset
                    </span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
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
      <Row className="asset-details-page">
        <Col lg={4}>
          <div className="asset-image">
            {loading ? (
              <Skeleton cardType="VIEW" />
            ) : (
              <>
                {cardSelect === 'image' && (
                  <>
                    <span className="asset-details-card-logo">
                      <ImageIconSvg />
                    </span>
                    <img
                      src={
                        AssetDetails?.assetMediaUrl ||
                        AssetDetails?.assetThumbnail
                      }
                      alt=""
                    />
                  </>
                )}
                {cardSelect === 'pdf' && (
                  <>
                    <span className="asset-details-card-logo">
                      <ImageIconSvg />
                    </span>
                    <img src={AssetDetails?.assetThumbnail} alt="" />
                  </>
                )}
                {cardSelect === 'threedimension' && (
                  <>
                    <span className="asset-details-card-logo">
                      <ThreeDimensional />
                    </span>
                    <Model modelUrl={AssetDetails?.assetMediaUrl} />
                  </>
                )}
                {cardSelect === 'audio' && (
                  <>
                    <span className="asset-details-card-logo"></span>
                    <AudioModel
                      audioUrl={AssetDetails?.assetMediaUrl}
                      thumbnailUrl={
                        AssetDetails?.assetThumbnail ||
                        AudioSampleThumbnailImage
                      }
                    />
                  </>
                )}
                {cardSelect === 'video' && (
                  <>
                    <span className="asset-details-card-logo">
                      <VideoSVG />
                    </span>
                    <VideoModel
                      videoUrl={AssetDetails?.assetMediaUrl}
                      thumbnailUrl={
                        AssetDetails?.assetThumbnail ||
                        AudioSampleThumbnailImage
                      }
                    />
                  </>
                )}
              </>
            )}
            {/* <div className="view">
              <ViewIcon />
            </div> */}
            {AssetDetails?.isLegallyVerified ||
              (AssetDetails?.assetVerificationStatus === 'completed' && (
                <div className="stamp">
                  <Image src={stamp} alt="" />
                </div>
              ))}
          </div>
          <div className="details-address">
            <span className="details-heading">Details</span>
            <div className="contract-address">
              <label htmlFor="">Contract Address</label>
              <div className="address">
                {AssetDetails?.catalogue?.txnHash ? (
                  <>
                    <CustomCopyToClipboard
                      text={AssetDetails?.catalogue?.txnHash}
                      lastSliceNumber={55}
                      sliceNumber={4}
                    />
                    <LinkButton />
                  </>
                ) : (
                  'N/A'
                )}
              </div>
            </div>

            <div className="block-chain-detail">
              <div className="chain-detail">
                <span>Token ID </span>
                <label htmlFor="">
                  {AssetDetails?.mintedTxId
                    ? `${AssetDetails?.mintedTxId?.slice(
                        0,
                        4,
                      )}.....${AssetDetails?.mintedTxId?.slice(55)}`
                    : 'N/A'}
                </label>
              </div>
              <div className="chain-detail blockchain-img">
                <span>Blockchain</span>
                <div>
                  <label htmlFor="">Kalptantra</label>
                  <Image src={chain} alt="" className="blockchain" />
                </div>
              </div>
            </div>
            {!!AssetDetails?.royalty && (
              <div className="creator-fees">
                <div>
                  <span>Creator fees</span>
                  <span onMouseOver={handleFeeInfo} onMouseOut={handleFeeInfo}>
                    <HintIcon fill="#0792F7" />
                  </span>
                  {isHoveringInfo && (
                    <div className="info-cont">
                      <span>
                        Royalty share is set by the asset creator and will be
                        deducted from seller earnings.
                      </span>
                      <OverlayBack fill="#f7f7f7" />
                    </div>
                  )}
                </div>
                <label htmlFor="">{AssetDetails?.royalty} %</label>
              </div>
            )}
          </div>

          {!!properties?.length && (
            <div className="properties-detail">
              <div className="label">Properties</div>
              <div className="properties-details">
                {properties?.length ? (
                  properties.map((property: any, idx: number) => (
                    <div key={`property_${idx}`} className="row">
                      <div className="col-xs-12 col-sm-6 custom-box gap-1">
                        <span>{property[0]}: </span>{' '}
                        <label>{property[1]}</label>
                      </div>
                    </div>
                  ))
                ) : (
                  <>-</>
                )}
              </div>
            </div>
          )}
        </Col>
        <Col lg={8}>
          {AssetDetails?.orderType === 'timed' && (
            <AuctionTimer
              bidStartDate={AssetDetails?.bidStartDate}
              bidEndDate={AssetDetails?.bidEndDate}
            />
          )}

          {AssetDetails?.isMultiple && (
            <div className="multiple-copies">
              <span className="w-100 text-center">
                {OnSaleCopiesAvailable} of {assetCounts?.totalCopies} copies on
                sale
              </span>
            </div>
          )}
          <div className="asset-details">
            {AssetDetails?.physicalAsset ? (
              <div
                className="asset-about"
                onClick={() => toggleAboutDropdown()}
              >
                <span>About</span>
                <span>
                  <Vector2SVG />
                </span>
              </div>
            ) : (
              <div className="asset-desc">{AssetDetails?.description}</div>
            )}
            {showAbout && (
              <div className="asset-desc">{AssetDetails?.description}</div>
            )}
            <div className="creator-current">
              <div className="owners-detail">
                <div className="owner-img">
                  <Image
                    src={AssetDetails?.creator?.profileImage || catalogs}
                    alt="" width={100} height={100}
                  />
                  <div className="verified">
                    <VerifiedSign width="24px" height="24px" />
                  </div>
                </div>
                <div className="owner-pos">
                  <span>Created By</span>
                  <Link
                    href={`/user/${AssetDetails?.creator?.id}`}
                    className="name text-decoration-none"
                  >
                    {AssetDetails?.creator?.userName}
                  </Link>
                </div>
              </div>
              <div className="owners-detail">
                <div className="owner-img">
                  <Image
                    src={AssetDetails?.owner?.profileImage || catalogs}
                    alt="" width={100} height={100}
                  />
                  <div className="verified">
                    <VerifiedSign width="24px" height="24px" />
                  </div>
                </div>
                <div className="owner-pos">
                  <span>Current Owner</span>
                  <Link
                    href={`/user/${AssetDetails?.owner?.id}`}
                    className="name text-decoration-none"
                  >
                    {AssetDetails?.owner?.userName}
                  </Link>
                </div>
              </div>
            </div>

            <div className="view-favourite">
              <div className="view-label">
                <EyeIcon />
                <span>{AssetDetails?.views}</span>
                <span>views</span>
              </div>
              <div
                className="view-label"
                onClick={() => handleFavouriteModal()}
              >
                <Favourite />
                <span>{Math.abs(AssetDetails?.likes)}</span>
                <span>Favorites</span>
              </div>
            </div>

            {AssetDetails?.isMultiple && isOwner ? (
              ''
            ) : (
              <AssetActionComponents
                handleMakeOfferBtn={handleModalOpen}
                handleBidNowBtn={handleBid}
              />
            )}

            <div className="buttons-download mt-3"></div>
          </div>
          <div className="asset-tabs">
            <ToggleTab
              tabs={tabs}
              activeToggle={activeTab}
              handleTabClick={handleSelectedTab}
            />
          </div>

          {AssetDetails?.id && (
            <div
              className="history-container"
              id="history-container-scrollable-div"
            >
              <TabsContent selectedTab={activeTab} />
            </div>
          )}
        </Col>
      </Row>
      <TopCatalogs
        className="similar"
        title="Similar Assets from this catalog"
        desc="Check out the video to make your journey even more easier."
        toggleTab={false}
        similarAssets={similarAssets}
      />

      {showDeleteModal && (
        <DeleteModal
          showModal={showDeleteModal}
          showErrModal={showErrModal}
          toggleModal={toggleDeleteModal}
          toggleErrModal={toggleErrModal}
          assetId={AssetDetails.id}
          isVerified={AssetDetails?.isLegallyVerified}
        />
      )}

      {/* Bid auction */}
      <GenericModal
        show={bidNow}
        onHide={handleBidClose}
        title="Place your Bid"
        body={<BidNow handlePlaceBid={handlePlaceBid} />}
        className=""
        close={true}
        backdrop="static"
      />

      {/* Make Offer Modal*/}
      <GenericModal
        show={modalShow}
        onHide={handleModalClose}
        title="Make an offer"
        body={<MakeOffer handleModalClose={handleModalClose} />}
        className=""
        close={true}
        backdrop="static"
      />

      {/* Favourite list */}
      <GenericModal
        show={favouriteModal}
        onHide={handleFavouriteModalClose}
        title="Favorited by"
        body={<FavouiteModal />}
        className="favourite-users-modal"
        close={true}
        backdrop="static"
      />
    </div>
  );
};

export default AssetDetails;
