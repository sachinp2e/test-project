import Button from '@/Components/Button';
import InputField from '@/Components/Input/Input';
import GenericModal from '@/Components/modal';
import { authSelector } from '@/Lib/auth/auth.selector';
import axiosInstance from '@/Lib/axios';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { addWalletBalance } from '@/Lib/wallet/wallet.slice';
import { toastErrorMessage } from '@/utils/constants';
import Gateways from 'mai-payment-aggregator';
import React, { useState } from 'react';
import purchaseSuccesLogo from '@/Assets/_images/success-animation1.gif';
import failedAnimation from '@/Assets/_images/failedanimation.gif'
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
interface Props {}

const headers = {
  apiKey:
    '605b540780fc72df639541b57b975b8496aa6073c8977e83084bd7af3f260ed1dd1189396ca01820a2b21846c3efda6ce2509fc50b94b0a9c7eba8e553d12f8f',
  environment_url: 'https://stg-paymentapi.p2eppl.com/v1',
};

const positiveNumberRegex = /^[1-9]\d*(\.\d+)?$/;

const AddFunds = (props: Props) => {
  const { userDetails } = useAppSelector(authSelector);
  const [showModal, toggleModal] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [initiatePayment, setInitiatePayment] = useState<boolean>(false);
  const [transactionPayload, setTransactionPayload] = useState<any>(null);
  const [showTransactionResponse, setShowTransactionResponse] =
    useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<boolean>(false);
  const [payload, setpayload] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const dispatch = useAppDispatch();

  const handleOnChangeAmount = (e: any) => {
    if (!positiveNumberRegex.test(e.target.value)) {
      setError('Invalid amount');
    } else {
      setError('');
    }
    setAmount(e.target.value);
  };
  const transactionStatusCallback = async (payload: any) => {
    if (payload?.transactionStatus === false) {
      return;
    }
    try {
      const response = await axiosInstance.post('/user/verify-transaction', {
        id: payload,
        message: 'Success',
      });
      if (response?.data?.result?.status === 202) {
        dispatch(addWalletBalance(Number(amount)));
        toggleModal(true);
        setPaymentStatus(true);
        setShowTransactionResponse(true);
      }
      setTransactionPayload(payload);
      setInitiatePayment(false);
    } catch (error) {
      toggleModal(true);
      setPaymentStatus(false);
      setShowTransactionResponse(true);
      setInitiatePayment(false);
    }
  };
  const initiateAddFunds = async () => {
    if (error || !amount) return;
    try {
      const response = await axiosInstance.post('/user/add-funds', { amount });
      if (response.data.status === 200) {
        handleClose();
        setUserInfo({
          name: (userDetails?.firstName || '') + (userDetails?.lastName || ''),
          email: userDetails?.email,
          phoneNumber: userDetails?.phone,
          countryCode: 'IND',
          redirect_url: 'https://google.com',
        });
        setpayload({
          productId: uuidv4(),
          referenceNumber: response.data.result?.data,
          amount: Number(amount),
          currencyCode: 'USD',
          paymentType: 'CARD',
        });
        setInitiatePayment(true);
      }
    } catch (error: any) {
      console.log(error);
      toastErrorMessage(
        'Something went wrong while adding funds! Please try after some time.',
      );
    }
  };
  const handleClose = () => {
    setInitiatePayment(false);
    setShowTransactionResponse(false);
    toggleModal(false);
  };
  return (
    <>
      {userInfo?.email && payload?.amount && initiatePayment && (
        <Gateways
          payload={payload}
          headers={headers}
          userInfo={userInfo}
          transactionStatusCallback={transactionStatusCallback}
        />
      )}
      <GenericModal
        show={showModal}
        onHide={handleClose}
        title={'Add Funds'}
        className="add-funds"
        close={true}
        body={
          // < show={showModal} onHide={handleClose}>
          <div className="">
            {showTransactionResponse ? (
              <>
                {' '}
                <div className='d-flex justify-content-center'>
                  <Image
                    src={paymentStatus ? purchaseSuccesLogo : failedAnimation}
                    alt=""
                    width={100}
                    height={100}
                  />
                </div>
                <p className="info-title text-center mx-10">
                  {paymentStatus ? 'Payment Success' : 'Fail to add funds!'}
                </p>
                <p className="info-desc text-center">
                  {paymentStatus
                    ? 'Amount has been added successfully'
                    : 'Please try again after some time'}
                </p>
                <div className="d-flex justify-content-center">
                  <Button
                    element={<span>Ok</span>}
                    className="mt-4"
                    isFilled
                    isGradient
                    onClick={handleClose}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="add-funds-form mb-2 mx-auto">
                  Enter Amount
                  <div className="d-flex align-items-center">
                    <InputField
                      name="amount"
                      placeholder="Amount"
                      type="TEXT"
                      value={amount}
                      onChange={handleOnChangeAmount}
                    />
                    <div className="selectCurrency ps-2">USD</div>
                  </div>
                </div>
                {error && (
                  <span
                    style={{
                      color: 'red',
                      fontSize: '14px',
                      position: 'relative',
                      left: '35%',
                    }}
                  >
                    {error}
                  </span>
                )}
                <div className="d-flex justify-content-center">
                  <Button
                    element={<span>Continue</span>}
                    className="mt-4"
                    isFilled
                    isGradient
                    onClick={initiateAddFunds}
                  />
                </div>
              </>
            )}
          </div>
        }
      />
      <Button
        isFilled
        isGradient
        onlyVerifiedAccess
        text="Add Funds"
        onClick={() => {
          setAmount('');
          setInitiatePayment(false);
          toggleModal(true);
        }}
      />
    </>
  );
};

export default AddFunds;
