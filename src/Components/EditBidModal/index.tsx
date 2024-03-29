import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import {  LogoWithoutName } from '@/Assets/svg';
import warningLogo from '@/Assets/warning.svg';
import Button from '@/Components/Button';
import axiosInstance from '@/Lib/axios';
import useEffectOnce from '@/Hooks/useEffectOnce';
import { useAppSelector } from '@/Lib/hooks';
import { getAllCurrenciesSelector } from '@/Lib/currencies/currencies.selector';
import './style.scss';
import ResultModal from '@/Components/ResultModal';
import ConfirmBidModal from '@/Components/EditBidModal/ConfirmBidModal';
import { useParams } from 'next/navigation';
import Image from 'next/image';
interface IEditBidProps {
  show: boolean;
  onHide: (e?: any) => void;
  assetId: string;
}

const EditBidModal: React.FC<IEditBidProps> = ({
  show,
  onHide,
  assetId = '96100eae-1a97-4816-828e-b8a3a26e7da3',
}) => {
  const { userId } = useParams();
  const [bidDetails, setBidDetails] = useState<any>(null);
  const [showConfirmModal, toggleConfirmModal] = useState<boolean>(false);
  const [bidAmount, setBidAmount] = useState<number | undefined>(undefined);
  const [success, setSuccess] = useState<null | {
    type: 'SUCCESS' | 'FAILURE';
    message: string;
  }>(null);

  const { currencies } = useAppSelector(getAllCurrenciesSelector);

  const fetchBidDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/bids/getBidsOnAsset?assetId=${assetId}`,
      );
      if (response.data.status === 200) {
        const filteredBidDetails = response.data.result.find(
          (bidDetailsObj: any) => bidDetailsObj?.bidPlacerId === userId,
        );
        setBidDetails({ ...filteredBidDetails });
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffectOnce(() => {
    fetchBidDetails();
  });

  const onUpdateBid = async () => {
    try {
      const payload = {
        bidCurrency: currencies.find((c) => c.isoCode === 'USD')?.id,
        bidAmount: Number(bidAmount),
      };
      const response = await axiosInstance.post(
        `/bids/${bidDetails.id}`,
        payload,
      );
      if (response.data.status === 200) {
        toggleConfirmModal(false);
        setSuccess({ type: 'SUCCESS', message: 'Bid updated successfully' });
      }
    } catch (err: any) {
      console.log(err);
      setSuccess({ type: 'FAILURE', message: 'Failed to update bid' });
    }
  };

  const onConfirm = () => {
    toggleConfirmModal(true);
  };

  const onBidAmountChange = (e: any) => {
    setBidAmount(e.target.value);
  };

  const onResultClick = () => {
    setSuccess(null);
    onHide();
  };

  if (success) {
    return (
      <ResultModal
        text={success.message}
        type={success.type}
        onProceed={onResultClick}
      />
    );
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className={`edit-modal ${showConfirmModal ? 'confirm-modal' : ''}`}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {showConfirmModal ? (
            <div className="confirm-modal">
              {/* <div className="background-image">
                <LogoWithoutName />
              </div> */}
              <label>Wallet</label>
            </div>
          ) : (
            <label>Edit your Bid</label>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showConfirmModal ? (
          <ConfirmBidModal
            onConfirm={onUpdateBid}
            amount={Number(( bidAmount || 0) - bidDetails?.bidAmount)}
          />
        ) : (
          <div className="edit-bid">
            <div className="section">
              <label>Current Bid</label>
              <p>{`$${bidDetails?.bidAmount || 0}`}</p>
            </div>
            <div className="section">
              <label>Enter new Bid</label>
              <div>
                <label className="enter-bid-label">USD</label>
                <input
                  type="number"
                  placeholder="Bid Amount"
                  onChange={onBidAmountChange}
                  value={bidAmount}
                />
              </div>
            </div>
            <div className="section">
              <label>Bid Difference</label>
              <p>
                {bidAmount
                  ? `$${(bidAmount || 0) - bidDetails?.bidAmount}.00`
                  : '$0.00'}
              </p>
            </div>
            <div className="info-section">
              <Image
                src={warningLogo}
                alt="close-icon"
                width={100}
                height={100}
                style={{ width: '20px', height: 'auto' }}
               />
              <span>
                Disclaimer: Price difference between current and new bid shall
                be paid when updating bids.
              </span>
            </div>
            <div className="confirm-edit-bid">
              <Button
                isFilled
                isGradient
                text="Confirm"
                disabled={!bidAmount || bidDetails?.bidAmount - bidAmount >= 0}
                onClick={onConfirm}
              />
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditBidModal;
