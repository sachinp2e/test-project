import React, { useEffect, useMemo, useState } from 'react';
import './bid-now.scss';
import Button from '@/Components/Button';
import { Warning } from '@/Assets/svg';
import { useAppSelector } from '@/Lib/hooks';
import { AssetDetailSelector } from '@/Lib/assetDetail/assetDetail.selector';
import { getAllCurrenciesSelector } from '@/Lib/currencies/currencies.selector';
import * as yup from 'yup';
import ConfirmBidModal from '@/Components/EditBidModal/ConfirmBidModal';
import axiosInstance from '@/Lib/axios';
import { authSelector } from '@/Lib/auth/auth.selector';
import useEffectOnce from '@/Hooks/useEffectOnce';

export const numberSchema = (minBid?: number) =>
  yup
    .number()
    .positive('Bid should be greater than 0')
    .required('Bid is required')
    .min(minBid ? minBid + 1 : 1, `Bid should be greater than ${minBid || 1}`);

const BidNow = ({ handlePlaceBid }: any) => {
  const { AssetDetails } = useAppSelector(AssetDetailSelector);
  const { currencies }: any = useAppSelector(getAllCurrenciesSelector);
  const { id }: any = useAppSelector(authSelector);

  const [serviceCharges, setServiceCharges] = useState<any>({});
  const [bid, setBid] = useState<string>('');
  const [bidCurrency, setBidCurrency] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showAvailableBalanceModal, toggleAvailableBalanceModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (currencies.length && !bidCurrency) {
      setBidCurrency(currencies[0].id);
    }
  }, [currencies]);

  useEffectOnce(() => {
    fetchServiceCharge();
  });

  const handleCurrencyChange = (e: any) => {
    setBidCurrency(e.target.value);
  };

  const fetchServiceCharge = async () => {
    const payload = {
      assetId: AssetDetails?.id,
      ownerId: AssetDetails?.owner?.id,
      buyerId: id,
      price: AssetDetails?.minBid,
    };
    try {
      const response = await axiosInstance.post('/orders/charges', payload);
      setServiceCharges(response?.data?.result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBidChange = (e: any) => {
    numberSchema(AssetDetails?.minBid)
      .validate(e.target.value || null)
      .then(() => {
        setError('');
      })
      .catch((err: any) => {
        setError(err.message);
      });
    setBid(e.target.value);
  };

  const handleConfirmBtn = () => {
    toggleAvailableBalanceModal(true);
  };

  const onConfirm = () => {
    if (!error) {
      handlePlaceBid(bid, bidCurrency);
    }
  };

  const totalBid = useMemo(()=>{
    const serviceCharge = Number(serviceCharges?.platformFee || 0) / 100 * Number(bid)
    
    return Number(bid || 0) + serviceCharge
  },[bid])

  return (
    <>
      {showAvailableBalanceModal ? (
        <ConfirmBidModal onConfirm={onConfirm} />
      ) : (
        <>
          <div className="bid-container">
            <div className="bid-left-content">
              <span>Highest Bid</span>
              <span>Minimum Bid </span>
            </div>
            <div className="bid-right-content">
              <span>
                {AssetDetails?.highestBid
                  ? `$${AssetDetails?.highestBid}`
                  : 'No bids yet'}
              </span>
              <span>{`$${AssetDetails?.minBid}`}</span>
            </div>
          </div>
          <div className="your-bid">
            Your Bid
            <input
              type="number"
              name="bidAmount"
              id="bidInput"
              value={bid}
              onChange={handleBidChange}
            />
            <select
              id="selectOption"
              name="USD"
              onChange={handleCurrencyChange}
            >
              {currencies?.map((currency: any, idx: number) => (
                <option key={`currecny_${idx}`} value={currency?.id}>
                  {currency?.isoCode}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="error-message text-center">{error}</p>}
          <div className="bids-left-content" style={{ textAlign: 'center' }}>
            <span>
              <b>Total Price Deductible</b>
            </span>
            <span>
              <p>{Number(totalBid).toFixed(3)} USD</p>
            </span>
          </div>

          <div className="disclaimer">
            <span className="offer-note">
              Note: Additional platform fees will be added to your bid price.{' '}
            </span>

            <div className="d-flex gap-2 align-items-center">
              <Warning />
              Disclaimer: Once the bid is placed it cannot be removed until the
              auction ends.
            </div>
            <div className="d-flex justify-content-center w-100 mt-4">
              <Button
                isFilled
                isGradient
                text="Proceed"
                onClick={handleConfirmBtn}
                className="mx-auto"
                disabled={AssetDetails?.minBid >= bid || !bidCurrency || !bid}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BidNow;
