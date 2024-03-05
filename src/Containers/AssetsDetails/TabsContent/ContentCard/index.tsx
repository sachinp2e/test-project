import Button from '@/Components/Button';
import { AssetDetailSelector } from '@/Lib/assetDetail/assetDetail.selector';
import { authSelector } from '@/Lib/auth/auth.selector';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import PutOnSaleModal from '../../AssetActionComponents/PutOnSaleModal';
import { toastErrorMessage, toastSuccessMessage } from '@/utils/constants';
import { removeAssetFromSale } from '@/Lib/assetDetail/assetDetail.action';
import CustomModal from '@/Components/CustomModal';
import InputField from '@/Components/Input/Input';
import GenericModal from '@/Components/modal';
import Checkout from '../../Checkout';
import { assetBought } from '@/Lib/assetDetail/assetDetail.slice';
import MakeOffer from '../../makeOffer';

export const ContentCard = ({
  img,
  title,
  price,
  date,
  listings,
  offers,
  isUnminTedCopiesAvailable,
  showCreatorPutOnSale,
  userSaleCopiesAvailable,
  item,
}: any) => {
  const { AssetDetails } = useAppSelector(AssetDetailSelector);
  const { id } = useAppSelector(authSelector);
  const router = useRouter();
  const dispatch = useAppDispatch();
  // put on sale states
  const [showSaleModal, toggleSaleModal] = useState<boolean>(false);

  // Buy states
  const [showPayModal, togglePayModal] = useState<boolean>(false);
  const [showBuyModal, toggleShowBuyModal] = useState<boolean>(false);

  // Make offer states
  const [showMakeOfferModal, toggleMakeOfferModal] = useState<boolean>(false);

  const handleShowOffer = () => {
    router.push(`/user/${AssetDetails?.creator?.id}`);
  };

  const handleShowPutOnSaleModal = () => {
    toggleSaleModal(true);
  };
  const handleBuyFromIndividual = () => {
    toggleShowBuyModal(true);
  };
  const handleMakeOfferBtn = () => {
    toggleMakeOfferModal(true);
  };
  const handleBuyModalClose = () => {
    toggleShowBuyModal(false);
    togglePayModal(false);
  };
  const handleMakeOfferModalClose = () => {
    toggleMakeOfferModal(false);
  };
  const handleConfirmBuy = () => {
    togglePayModal(true);
  };
  const handlePurchaseSuccess = () => {
    dispatch(assetBought());
    toggleShowBuyModal(false);
    togglePayModal(false);
    toastSuccessMessage('Purchased successful!');
    // setPurchaseSuccessful(true);
    // toggleModal(true);
  };

  const showOwnerCTA = useMemo(() => {
    const isCreator = id === AssetDetails?.creator?.id;
    const isOwner = id === item?.owner_id;
    return showCreatorPutOnSale ? isCreator : isOwner;
  }, [AssetDetails, id, item?.owner_id, showCreatorPutOnSale]);

  return (
    <div className="history-card">
      <div className="left-content">
        <div className="history-icons">
          <Image src={img} alt="" width={50} height={50} />
        </div>
        <div className="title-name">
          {title}
          <label>{price}</label>
        </div>
      </div>
      <div className="right-content">
        {date && <span>{date}</span>}
        {offers && (
          <>
            {showOwnerCTA ? (
              <div className="d-flex gap-2">
                <Button
                  isFilled
                  isGradient
                  text="Show Offer"
                  onClick={handleShowOffer}
                />
                {AssetDetails?.availableSupply > 0 && (
                  <Button
                    isGradient
                    text="Put on Sale"
                    onClick={handleShowPutOnSaleModal}
                  />
                )}
              </div>
            ) : (
              <Button
                isFilled
                isGradient
                text="Make Offer"
                onClick={handleMakeOfferBtn}
              />
            )}
          </>
        )}
        {listings && (
          <>
            {showOwnerCTA ? (
              <div className="d-flex gap-2">
                {AssetDetails?.onSaleSupply > 0 && (
                  <RemoveAssetFromSale
                    userSaleCopies={userSaleCopiesAvailable}
                  />
                )}
              </div>
            ) : (
              <Button
                isFilled
                isGradient
                text="Buy Now"
                onClick={handleBuyFromIndividual}
              />
            )}
          </>
        )}
      </div>

      <PutOnSaleModal
        showModal={showSaleModal}
        toggleModal={toggleSaleModal}
        AssetDetails={AssetDetails}
        isUnminTedCopiesAvailable={isUnminTedCopiesAvailable}
        copiesAvailable={item?.offSaleAssetCount}
      />
      <GenericModal
        show={showMakeOfferModal}
        onHide={handleMakeOfferModalClose}
        title="Make an offer"
        body={
          <MakeOffer
            availableCopies={
              isUnminTedCopiesAvailable
                ? AssetDetails?.availableSupply - AssetDetails?.onSaleSupply
                : item?.offSaleAssetCount
            }
            individualOwnerId={
              isUnminTedCopiesAvailable
                ? AssetDetails?.creator?.id
                : item?.owner_id
            }
            handleModalClose={handleMakeOfferModalClose}
          />
        }
        className=""
        close={true}
      />
      <GenericModal
        show={showBuyModal}
        onHide={handleBuyModalClose}
        title={
          showPayModal
            ? 'Wallet'
            : `Buy from ${
                isUnminTedCopiesAvailable
                  ? AssetDetails?.creator?.userName
                  : item?.owner_userName
              }`
        }
        body={
          <Checkout
            handleConfirm={handleConfirmBuy}
            isPayModal={showPayModal}
            handlePurchaseSuccess={handlePurchaseSuccess}
            handleIndividualCase
            individualCopies={
              isUnminTedCopiesAvailable
                ? AssetDetails?.onSaleSupply
                : item?.onSaleAssetCount
            }
            sellerId={
              isUnminTedCopiesAvailable
                ? AssetDetails?.creator?.id
                : item?.owner_id
            }
          />
        }
        className=""
        close={true}
      />
    </div>
  );
};

const RemoveAssetFromSale = ({ userSaleCopies }: any) => {
  const [quantity, setQuantity] = useState<string>('');
  const [showModal, toggleModal] = useState<boolean>(false);
  const { AssetDetails } = useAppSelector(AssetDetailSelector);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    toggleModal(false);
  };

  const handleRemovefromSale = () => {
    toggleModal(true);
  };

  const handleQuantityChange = (e: any) => {
    setQuantity(e.target.value);
  };

  const handleConfirmbtn = () => {
    if (Number(userSaleCopies) < Number(quantity)) {
      return toastErrorMessage('Count exceeded!!');
    }

    dispatch(
      removeAssetFromSale({
        assetId: AssetDetails?.id,
        supply: Number(quantity),
      }),
    ).then((res) => {
      if (res?.payload?.status === 200) {
        toastSuccessMessage('Asset copies removed from sale successfully!');
        handleClose();
      }
    });
  };

  return (
    <>
      <Button
        isGradient
        isFilled
        text="Remove from Sale"
        onClick={handleRemovefromSale}
      />
      <CustomModal show={showModal} onHide={handleClose}>
        <div className="confirm-modal">
          <p className="confirm-modal-title">
            Count of copies to remove from sale
          </p>
          <InputField
            type="TEXT"
            name="supply"
            label="Copies"
            placeholder="Enter Copies"
            className="number-of-asset-input mb-5"
            value={quantity}
            onChange={handleQuantityChange}
          />
          <div className="d-flex gap-3 w-100 justify-content-center">
            <Button isGradient element={<p>Cancel</p>} onClick={handleClose} />
            <Button
              isGradient
              isFilled
              element={<span className="rmv-btn">Remove</span>}
              onClick={handleConfirmbtn}
            />
          </div>
        </div>
      </CustomModal>
    </>
  );
};
