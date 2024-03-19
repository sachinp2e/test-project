import React, { useMemo, useState } from 'react';
import * as Yup from 'yup';
import { Increase, PencilLogo, Reduce } from '@/Assets/svg';
import Button from '@/Components/Button';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import Image from 'next/image';
import './styles.scss';
import ArrowBtnImg from '../../../Assets/_images/arrow-circle-right.svg';
import { authSelector } from '@/Lib/auth/auth.selector';
import CustomModal from '@/Components/CustomModal';
import PutOnSaleModal from './PutOnSaleModal';
import { AssetDetailSelector } from '@/Lib/assetDetail/assetDetail.selector';
import { removeAssetFromSale } from '@/Lib/assetDetail/assetDetail.action';
import GenericModal from '@/Components/modal';
import Checkout from '../Checkout';
import transferGif from '@/Assets/_images/transfer.gif';
import {
  assetBought,
  updateAssetDetails,
} from '@/Lib/assetDetail/assetDetail.slice';
import VerifyAssetModal from '@/Containers/AssetsDetails/AssetActionComponents/VerifyAssetModal';
import axiosInstance from '@/Lib/axios';
import { toastErrorMessage, toastSuccessMessage } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import SuccessToaster from '@/Assets/_images/sucess-animation.gif';

type Props = {
  handleBidNowBtn: () => void;
  handleMakeOfferBtn: () => void;
};

const schema = Yup.string()
  .test('is-number', 'Not a valid price', (value: any) => !isNaN(value))
  .test(
    'is-greater-than-one',
    'Price should be greater than 1',
    (value: any) => parseFloat(value) > 1,
  );

const AssetActionComponents = ({
  handleMakeOfferBtn,
  handleBidNowBtn,
}: Props) => {
  const { AssetDetails, assetCounts } = useAppSelector(AssetDetailSelector);
  const { id } = useAppSelector(authSelector);

  const isOwner = useMemo(() => {
    return AssetDetails?.owner?.id === id;
  }, [id, AssetDetails]);

  return (
    <>
      {AssetDetails?.orderType === 'none' && (
        <OfferActionComponents
          AssetDetails={AssetDetails}
          isOwner={isOwner}
          handleMakeOfferBtn={handleMakeOfferBtn}
        />
      )}
      {AssetDetails?.orderType === 'fixed' && (
        <FixedActionComponents
          AssetDetails={AssetDetails}
          isOwner={isOwner}
          onSaleAssetCount={
            assetCounts?.onSaleAssetCount + AssetDetails?.onSaleSupply
          }
        />
      )}
      {AssetDetails?.orderType === 'timed' && (
        <AuctionActionComponents
          AssetDetails={AssetDetails}
          isOwner={isOwner}
          handleBidNowBtn={handleBidNowBtn}
        />
      )}
    </>
  );
};

export default AssetActionComponents;

const OfferActionComponents = ({
  AssetDetails,
  isOwner,
  handleMakeOfferBtn,
}: any) => {
  const router = useRouter();
  const { id } = useAppSelector(authSelector);
  const [showModal, togglemodal] = useState<boolean>(false);
  const [showVerifyAssetModal, toggleVerifyModal] = useState<boolean>(false);

  const handleSaleOrOfferbtn = () => {
    if (isOwner) {
      return togglemodal(true);
    }
    if (AssetDetails?.userOffer?.id) {
      router.push(`/user/${id}?tab=Offers`);
    } else {
      handleMakeOfferBtn();
    }
  };

  const onToggleVerifyAsset = () => {
    toggleVerifyModal(!showVerifyAssetModal);
  };

  return (
    <>
      <div className="offers-section">
        {AssetDetails?.onHold ? (
          <span>
            Transfer in progress{' '}
            <Image src={transferGif} alt="" width={60} height={60} />
          </span>
        ) : (
          <>
            <span>Highest Offer: </span>
            <label>${AssetDetails?.highestOffer ?? 0}</label>
          </>
        )}
      </div>
      <div className="verify-btn-group">
        <div className="make-offer-button">
          <Button
            isFilled
            isGradient
            onlyVerifiedAccess
            element={
              <div className="d-flex align-items-center">
                <span className="me-2">
                  {isOwner
                    ? 'Put on Sale'
                    : `${AssetDetails?.userOffer?.id ? 'Show' : 'Make'} Offer`}
                </span>
                <Image src={ArrowBtnImg} alt="arrow" />
              </div>
            }
            disabled={AssetDetails?.onHold}
            onClick={handleSaleOrOfferbtn}
          />
          {/* {AssetDetails?.isMultiple && (
            <div className="quantity-counter">
              <span>Quantity </span>
              <div className="counter">
                <div
                  className="reduce"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (quantity > 0) setQuantity((prev) => prev - 1);
                  }}
                >
                  <Reduce />
                </div>
                <div className="actual-count">{quantity}</div>
                <div
                  className="increase"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setQuantity((prev) => prev + 1);
                  }}
                >
                  <Increase />
                </div>
              </div>
            </div>
          )} */}
        </div>
        <Verification
          isOwner={isOwner}
          assetDetails={AssetDetails}
          assetId={AssetDetails?.id}
          isLegallyVerified={AssetDetails?.isLegallyVerified}
          certificateId={AssetDetails?.certificateId}
          assetVerificationStatus={AssetDetails?.assetVerificationStatus}
          onHold={AssetDetails?.onHold}
          isMultiple={AssetDetails?.isMultiple}
          onVerifyAsset={onToggleVerifyAsset}
        />
      </div>
      {showVerifyAssetModal && (
        <VerifyAssetModal
          assetId={AssetDetails?.id}
          onClose={onToggleVerifyAsset}
        />
      )}
      <PutOnSaleModal
        showModal={showModal}
        toggleModal={togglemodal}
        AssetDetails={AssetDetails}
      />
    </>
  );
};

const FixedActionComponents = ({
  AssetDetails,
  isOwner,
  onSaleAssetCount,
}: any) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [showModal, toggleModal] = useState<boolean>(false);
  const [showPayModal, togglePayModal] = useState<boolean>(false);
  const [showBuyModal, toggleBuyModal] = useState<boolean>(false);
  const [purchaseSuccessful, setPurchaseSuccessful] = useState<boolean>(false);
  const [showVerifyAssetModal, toggleVerifyModal] = useState<boolean>(false);
  const [showEditPrice, toggleEditPrice] = useState<boolean>(false);
  const [newPrice, setNewPrice] = useState<string>(AssetDetails?.price);
  const [error, setError] = useState<string>('');
  const dispatch = useAppDispatch();

  const handleRemovefromSale = () => {
    dispatch(
      removeAssetFromSale({ assetId: AssetDetails?.id, supply: quantity }),
    ).then((res) => {
      if (res?.payload?.status === 200) {
        toastSuccessMessage('Asset removed from sale successfully!');
        toggleModal(false);
      }
    });
  };

  const handleBuyModalClose = () => {
    togglePayModal(false);
    toggleBuyModal(false);
  };
  const handleConfirmBuy = () => {
    togglePayModal(true);
  };
  const handleBuyOrRemoveBtn = () => {
    if (isOwner) {
      return toggleModal(true);
    }
    toggleBuyModal(true);
  };

  const handlePurchaseSuccess = () => {
    dispatch(assetBought());
    toggleBuyModal(false);
    togglePayModal(false);
    setPurchaseSuccessful(true);
    toggleModal(true);
  };

  const handleOkBtn = () => {
    toggleModal(false);
  };

  const onToggleVerifyAsset = () => {
    toggleVerifyModal(!showVerifyAssetModal);
  };
  const handleEditButton = () => {
    toggleEditPrice(true);
  };
  const handleCancelButton = () => {
    toggleEditPrice(false);
    setNewPrice(AssetDetails?.price);
    setError('');
  };
  const handlePriceChange = (e: any) => {
    const value = e.target.value;
    schema
      .validate(value)
      .then(() => {
        setError('');
      })
      .catch((error) => {
        // If validation fails, handle the error (e.g., show error message)
        setError(error.message);
      })
      .finally(() => {
        setNewPrice(value);
      });
  };
  const handlePriceUpdate = async () => {
    try {
      const response = await axiosInstance.patch(`/asset/${AssetDetails.id}`, {
        price: newPrice,
      });
      if (response?.data?.status === 200) {
        toastSuccessMessage('Price updated successfully.');
        dispatch(updateAssetDetails({ price: newPrice }));
        toggleEditPrice(false);
      }
    } catch (error: any) {
      toastErrorMessage('Something went wrong while updating price.');
    }
  };

  return (
    <>
      <div className="offers-section">
        {AssetDetails?.onHold && !AssetDetails?.isMultiple ? (
          <span>
            Transfer in progress{' '}
            <Image src={transferGif} alt="" width={60} height={60} />
          </span>
        ) : (
          <>
            {showEditPrice ? (
              <>
                <div className="form__group field">
                  <input
                    type="input"
                    className="form__field"
                    placeholder="Name"
                    name="name"
                    id="name"
                    required
                    value={newPrice}
                    onChange={handlePriceChange}
                    autoFocus
                  />
                  <label className="form__label">Price</label>
                </div>
                {error && <p className="error-message">{error}</p>}
              </>
            ) : (
              <span className="d-flex align-items-center">
                Price:{' '}
                <label className="me-2">
                  ${AssetDetails?.price ?? 0}
                  {AssetDetails?.isMultiple && <span>/copy</span>}
                </label>
                {isOwner && (
                  <div className="" onClick={handleEditButton}>
                    <PencilLogo />
                  </div>
                )}
              </span>
            )}
          </>
        )}
      </div>

      {showEditPrice ? (
        <div className="mt-4 d-flex gap-4">
          <Button
            isGradient
            onlyVerifiedAccess
            text="Cancel"
            onClick={handleCancelButton}
          />
          <Button
            isFilled
            isGradient
            onlyVerifiedAccess
            text="Update"
            onClick={handlePriceUpdate}
            disabled={!!error}
          />
        </div>
      ) : (
        <div className="verify-btn-group">
          <div className="make-offer-button">
            <Button
              isFilled
              isGradient
              onlyVerifiedAccess
              element={
                <div className="d-flex align-items-center">
                  <span className="me-2">
                    {isOwner ? 'Remove from Sale' : 'Buy Now'}
                  </span>
                  <Image src={ArrowBtnImg} alt="arrow" />
                </div>
              }
              onClick={() => handleBuyOrRemoveBtn()}
              disabled={AssetDetails?.onHold && !AssetDetails?.isMultiple}
            />
            {AssetDetails?.isMultiple && (
              <div className="quantity-counter">
                <span>Quantity </span>
                <div className="counter">
                  <div
                    className="reduce"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (quantity > 0) setQuantity((prev) => prev - 1);
                    }}
                  >
                    <Reduce />
                  </div>
                  <div className="actual-count">{quantity}</div>
                  <div
                    className="increase"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (quantity < onSaleAssetCount) {
                        setQuantity((prev) => prev + 1);
                      }
                    }}
                  >
                    <Increase />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Verification
            isOwner={isOwner}
            assetDetails={AssetDetails}
            assetId={AssetDetails?.id}
            isLegallyVerified={AssetDetails?.isLegallyVerified}
            certificateId={AssetDetails?.certificateId}
            assetVerificationStatus={AssetDetails?.assetVerificationStatus}
            onHold={AssetDetails?.onHold}
            isMultiple={AssetDetails?.isMultiple}
            onVerifyAsset={onToggleVerifyAsset}
          />
        </div>
      )}
      <CustomModal show={showModal} onHide={() => toggleModal(false)}>
        {purchaseSuccessful ? (
          <>
            <div className="proifle-image-buyasset">
              <Image
                src={SuccessToaster}
                width={1000}
                height={1000}
                alt="tick-mark-gif"
                quality={100}
              />
            </div>
            <p className="text-center fs-4 fw-medium">Purchase Successful!</p>
            <p className="text-center modal-desc-success">
              Transaction is now in progress and will take few minutes to get
              the ownership transferred!
            </p>
            <div className="d-flex justify-content-center mt-4">
              <Button isFilled isGradient text="Ok" onClick={handleOkBtn} />
            </div>
          </>
        ) : (
          <div className="confirm-modal-rmv">
            <p className="confirm-modal-title">
              Do you really want to remove this Asset from sale?
            </p>
            <div className="d-flex gap-3 w-100 justify-content-center">
              <Button
                isGradient
                element={<p>Cancel</p>}
                onClick={() => toggleModal(false)}
              />

              <Button
                isGradient
                isFilled
                element={<span className="rmv-btn">Remove</span>}
                onClick={handleRemovefromSale}
              />
            </div>
          </div>
        )}
      </CustomModal>
      <GenericModal
        show={showBuyModal}
        onHide={handleBuyModalClose}
        title={showPayModal ? 'Wallet' : 'Checkout'}
        body={
          <Checkout
            handleConfirm={handleConfirmBuy}
            isPayModal={showPayModal}
            handlePurchaseSuccess={handlePurchaseSuccess}
            quantity={quantity}
          />
        }
        className="checkout-modal"
        close={true}
      />
      {showVerifyAssetModal && (
        <VerifyAssetModal
          assetId={AssetDetails?.id}
          onClose={onToggleVerifyAsset}
        />
      )}
    </>
  );
};

const AuctionActionComponents = (props: any) => {
  const { AssetDetails, isOwner, handleBidNowBtn } = props;
  const { id } = useAppSelector(authSelector);
  const router = useRouter();
  const [showVerifyAssetModal, toggleVerifyModal] = useState<boolean>(false);

  const handleBidOrShow = () => {
    if (AssetDetails?.userBid?.id) {
      return router.push(`/user/${id}?tab=Bids`);
    }
    handleBidNowBtn();
  };

  const onToggleVerifyAsset = () => {
    toggleVerifyModal(!showVerifyAssetModal);
  };

  return (
    <>
      <div className="offers-section flex-row gap-5">
        <div className="d-flex flex-column">
          <span>Minimum Bid:</span>
          <label> ${AssetDetails?.minBid}</label>
        </div>
        <div className="d-flex flex-column">
          <span>Highest Bid:</span>
          <label> ${AssetDetails?.highestBid?.toFixed(2)}</label>
        </div>
      </div>

      <div className="verify-btn-group">
        {!isOwner && (
          <>
            <div className="make-offer-button">
              <Button
                isFilled
                isGradient
                onlyVerifiedAccess
                element={
                  <div className="d-flex align-items-center">
                    <span className="me-2">
                      {AssetDetails?.userBid?.id ? 'Show Bid' : 'Bid Now'}
                    </span>
                    <Image src={ArrowBtnImg} alt="arrow" />
                  </div>
                }
                onClick={() => handleBidOrShow()}
              />
            </div>
          </>
        )}
        <Verification
          isOwner={isOwner}
          assetDetails={AssetDetails}
          assetId={AssetDetails?.id}
          isLegallyVerified={AssetDetails?.isLegallyVerified}
          certificateId={AssetDetails?.certificateId}
          assetVerificationStatus={AssetDetails?.assetVerificationStatus}
          onHold={AssetDetails?.onHold}
          isMultiple={AssetDetails?.isMultiple}
          onVerifyAsset={onToggleVerifyAsset}
        />
        {showVerifyAssetModal && (
          <VerifyAssetModal
            assetId={AssetDetails?.id}
            onClose={onToggleVerifyAsset}
          />
        )}
      </div>
    </>
  );
};

const Verification = (props: any) => {
  const {
    isOwner,
    assetDetails,
    assetId,
    certificateId,
    assetVerificationStatus,
    isLegallyVerified = false,
    onVerifyAsset,
    onHold,
    isMultiple,
  } = props;

  if (!isOwner || (assetDetails?.onHold && !assetDetails?.isMultiple)) {
    return null;
  }

  const onClick = async () => {
    if (
      isLegallyVerified ||
      (certificateId && assetVerificationStatus === 'completed')
    ) {
      try {
        const response = await axiosInstance.post(`/user/redirect_url/`, {
          certificateId,
        });
        if (response.data?.result?.url) {
          window.open(response.data.result.url, '_blank');
        }
      } catch (error) {
        console.error('Error while fetching certificate url', error);
      }
    } else {
      onVerifyAsset();
    }
  };

  if (
    certificateId &&
    !(isLegallyVerified || assetVerificationStatus === 'completed')
  ) {
    return <button className="view-download">Verification in process</button>;
  }

  return (
    <button className="view-download" onClick={onClick}>
      {isLegallyVerified || assetVerificationStatus === 'completed'
        ? 'View/Download Certificate'
        : 'Verify Asset'}
    </button>
  );
};
