import React, { useEffect, useMemo, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Image from 'next/image';
import { Info, VerifiedSign } from '@/Assets/svg';
import Button from '@/Components/Button';
import './checkout.scss';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { AssetDetailSelector } from '@/Lib/assetDetail/assetDetail.selector';
import maiLogo from '@/Assets/_images/Group.svg';
import { walletSelector } from '@/Lib/wallet/wallet.selector';
import AddFunds from '@/Containers/settings/MyWallet/AddFunds';
import axiosInstance from '@/Lib/axios';
import { authSelector } from '@/Lib/auth/auth.selector';
import { ButtonGroup } from 'react-bootstrap';
import { toastErrorMessage } from '@/utils/constants';
import { updateAssetDetails } from '@/Lib/assetDetail/assetDetail.slice';

type ICheckoutProps = {
  handleConfirm: () => void;
  handlePurchaseSuccess: () => void;
  isPayModal: boolean;
  quantity?: number;
  handleIndividualCase?: boolean;
  individualCopies?: number;
  sellerId?: string;
};

const Checkout = ({
  handleConfirm,
  isPayModal,
  handlePurchaseSuccess,
  quantity = 1,
  handleIndividualCase,
  individualCopies = 1,
  sellerId,
}: ICheckoutProps) => {
  const { AssetDetails } = useAppSelector(AssetDetailSelector);
  const { id }: any = useAppSelector(authSelector);
  const [serviceCharges, setServiceCharges] = useState<any>({});
  const [selectedCopies, setSelectedCopies] = useState<number>(1);
  const dispatch = useAppDispatch();
  useEffect(() => {
    fetchServiceCharge();
  }, []);

  const fetchServiceCharge = async () => {
    const payload = {
      assetId: AssetDetails?.id,
      ownerId: AssetDetails?.owner?.id,
      buyerId: id,
      price: AssetDetails?.price,
    };
    try {
      const response = await axiosInstance.post('/orders/charges', payload);
      setServiceCharges(response?.data?.result);
    } catch (error) {
      console.log(error);
    }
  };
  const initiateBuy = async () => {
    try {
      let url = '/asset/buy';
      const payload: any = {
        assetId: AssetDetails?.id,
        supply: handleIndividualCase ? selectedCopies : quantity,
        amount: Number(totalPrice),
      };
      if (handleIndividualCase) {
        url = '/asset/buy-user-asset';
        payload.sellerId = sellerId;
      }
      const response = await axiosInstance.post(url, payload);
      if (handleIndividualCase && sellerId === AssetDetails?.creator?.id) {
        dispatch(
          updateAssetDetails({
            onSaleSupply: AssetDetails?.onSaleSupply - selectedCopies,
          }),
        );
      }
      handlePurchaseSuccess();
    } catch (error: any) {
      toastErrorMessage('Something went wrong! Please try after some time.');
    }
  };
  const handleAddSubtract = (e: any) => {
    if (e.target.name === 'add' && selectedCopies < individualCopies) {
      setSelectedCopies((prev) => prev + 1);
    } else if (e.target.name === 'subtract' && selectedCopies > 1) {
      setSelectedCopies((prev) => prev - 1);
    }
  };

  const totalPrice = useMemo(() => {
    if (handleIndividualCase) {
      return (AssetDetails?.price * selectedCopies).toFixed(2);
    }
    return (AssetDetails?.price * quantity).toFixed(2);
  }, [AssetDetails?.price, selectedCopies]);

  return (
    <>
      {isPayModal ? (
        <div>
          <PayoutWalletModal
            amount={totalPrice}
            AssetDetails={AssetDetails}
            initiatePayment={initiateBuy}
          />
        </div>
      ) : (
        <div className="checkout-container">
          <div className="asset-details">
            <div className="asset-image">
              <Image
                src={
                   AssetDetails?.assetThumbnail || AssetDetails?.assetMediaUrl
                }
                alt=""
                width={300}
                height={300}
              />
            </div>
            <div className="asset-information">
              <div className="d-flex gap-1 ">
                <span className="d-flex gap-1 flex-row asset-name"> 
                  {AssetDetails?.name}

                  {AssetDetails?.isLegallyVerified && (
                    <VerifiedSign width="24px" height="24px" />
                  )}
                </span>
              </div>
              <div className="d-flex flex-column asset-creator-name">
                <span>
                  Created By: <b>{AssetDetails?.creator?.userName}</b> <VerifiedSign width="18px" height="18px" />{' '}
                </span>
              </div>
            </div>
          </div>
          {handleIndividualCase && (
            <div className="d-flex justify-content-between align-items-center my-5">
              <p>Select Quantity</p>
              <ButtonGroup>
                <Button text="-" onClick={handleAddSubtract} name="subtract" />
                <Button text={selectedCopies.toString()} />
                <Button text="+" onClick={handleAddSubtract} name="add" />
              </ButtonGroup>
            </div>
          )}

          <div className='checkout-heading'>
            Amount
          </div>
          <div className="horizontal-rule" />

          <div className="price-break mt-4">
            <div className="left-label">
              <span>Asset Price</span>
              {AssetDetails?.isMultiple && <span>Quantity</span>}
              <span>Platform fee</span>
              <span>Total</span>
            </div>
            <div className="right-label">
              <span>
                <b>{AssetDetails?.price}</b>
              </span>
              {AssetDetails?.isMultiple && (
                <span>
                  <b>{handleIndividualCase ? selectedCopies : quantity}</b>
                </span>
              )}
              <span>
                <b>{serviceCharges?.platformFee}%</b>
              </span>
              <span>
                <b>{Number(totalPrice) + Number(serviceCharges?.serviceCharge)}</b>
              </span>
            </div>
          </div>
          <div className="horizontal-rule" />

          <div className="total-money">
            <div className="left-price">
              Total
              <b>${Number(totalPrice) + Number(serviceCharges?.serviceCharge)}</b>
            </div>
            <Button
              text="Proceed"
              className="proceed-button"
              onClick={handleConfirm}
            />
          </div>

          <div className="info-field">
            <Info /> All amount will be facilitated in the standard USD currency
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;

export const PayoutWalletModal = ({ amount, initiatePayment }: any) => {
  const { walletBalance } = useAppSelector(walletSelector);
  const [isWalletChecked, setIsWalletChecked] = useState<boolean>(false);

  const isSufficientBalance = useMemo(() => {
    return Number(amount) <= Number(walletBalance);
  }, [amount, walletBalance]);

  const handleWalletCheck = (e: any) => {
    setIsWalletChecked(e.target.checked);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <Form.Check
          type="checkbox"
          id={`myipr-checkbox`}
          checked={isWalletChecked}
          label={
            <div className="d-flex ms-3 gap-3 align-items-center">
              <Image src={maiLogo} alt="" width={40} height={40} />
              <div className="">
                <p className="fs-4">Wallet</p>
                <p>
                  Available balance: <b style={{color:'#85CB33'}}>$ {walletBalance}</b>
                </p>
              </div>
            </div>
          }
          onChange={handleWalletCheck}
        />
        <AddFunds />
      </div>
      {!isSufficientBalance && (
        <p className="error-message mt-4 d-flex justify-content-center">Insufficient Balance</p>
      )}
      <div className="d-flex justify-content-center mt-5">
        <Button
          isFilled
          isGradient
          text="Continue"
          className="proceed-button"
          onClick={initiatePayment}
          disabled={!isWalletChecked! || !isSufficientBalance}
        />
      </div>
      
    </>
  );
};
