import Button from '@/Components/Button';
import React, { useState } from 'react';
import Image from 'next/image';
import { Modal } from 'react-bootstrap';
import './style.scss'
import { CrossCircleIcon } from '@/Assets/svg';
import { useAppDispatch } from '@/Lib/hooks';
import SuccessAnimation from '@/Assets/_images/sucess-animation.gif';
import { acceptRejectOfferAction, getAllReceivedOffers } from '@/Lib/users/users.action';
import { getWalletDetails } from '@/Lib/wallet/wallet.action';

interface IOfferCardBtn {
  item: any;
}

const OfferCardBtn: React.FC<IOfferCardBtn> = ({ item }) => {
  const dispatch = useAppDispatch();
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);

  const toggleConfirmationModal = () => {
    setConfirmModalOpen((prev) => !prev);
  };

  const toggleSuccessModal = () => {
    setSuccessModalOpen((prev) => !prev);
  }

  const toggleRejectionModal = () => {
    setRejectModalOpen((prev) => !prev);
  };

  const handleAcceptOffer = async (e:any) => {
    e.preventDefault();
    e.stopPropagation();
    const data = await dispatch(
      acceptRejectOfferAction({
        offerId: item.offerId,
        assetId: item.id,
        query: true
      }),
    );
    if (data.payload.status === 200) {
      toggleSuccessModal();
    }
    toggleConfirmationModal();
  }

  const handleSuccessModal = () => {
    dispatch(getAllReceivedOffers({}));
    dispatch(getWalletDetails());
    toggleSuccessModal();
  }

  const handleRejectOffer = async () => { 
    const data = await dispatch(
      acceptRejectOfferAction({
        offerId: item.offerId,
        assetId: item.id,
        query: false
      }),
    );
    if (data.payload.status === 200) {
      dispatch(getAllReceivedOffers({}));
    }
    toggleRejectionModal();
  }

  return (
    <div className="d-flex offer-hover-footer">
      <button onClick={toggleConfirmationModal}>Accept</button>
      <button onClick={toggleRejectionModal}>Reject</button>
      <Modal
        show={confirmModalOpen}
        onHide={toggleConfirmationModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="custom-confirmation-modal-container"
      >
        <div className="d-flex flex-column confirmation-body-wrapper">
          <header className="d-flex justify-content-between">
            <span>Accept Offer</span>
            <div onClick={toggleConfirmationModal}>
              <CrossCircleIcon />
            </div>
          </header>
          <hr />
          <section className="d-flex justify-content-between mb-3">
            <div className="d-flex flex-column gap-2 left-col">
              <span>Asset Name</span>
              <span>Quantity</span>
              <span>Offer Price</span>
            </div>
            <div className="d-flex flex-column gap-2 right-col">
              <span>{item?.name}</span>
              <span>{item?.supply}</span>
              <span>{item?.offerAmount} USD</span>
            </div>
          </section>
          <div className="my-2 fees-container">
            <span>Fees</span>
            <div></div>
          </div>
          {/* <div className="my-2">
            <span>Fees</span>
            <div className="hr-line"></div>
          </div> */}
          <section className="d-flex justify-content-between">
            <div className="d-flex flex-column gap-2 left-col">
              <span>Commision</span>
              <span>Royalty</span>
            </div>
            <div className="d-flex flex-column gap-2 right-col">
              <span>2.5%</span>
              <span>-</span>
            </div>
          </section>
          <hr />
          <footer className="d-flex justify-content-between mb-4">
            <span>Earnings</span>
            <span>{((Number(item?.price) * 0.025) + Number(item?.price)).toFixed(2)} USD</span>
          </footer>
          <Button
            isFilled
            isGradient
            text="Confirm"
            onClick={handleAcceptOffer}
          />
        </div>
      </Modal>
      <Modal
        show={rejectModalOpen}
        onHide={toggleRejectionModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="custom-confirmation-modal-container"
      >
        <div className="d-flex flex-column justify-content-center rejection-body-wrapper">
          <header className="d-flex justify-content-end">
            <div onClick={toggleRejectionModal}>
              <CrossCircleIcon />
            </div>
          </header>
          <span className="d-flex justify-content-between mb-3">Are you sure you want to reject this offer ?</span>
          <Button
            isFilled
            isGradient
            text="Yes"
            onClick={handleRejectOffer}
          />
        </div>
      </Modal>
      <Modal show={successModalOpen} onHide={handleSuccessModal} className="result-modal" centered backdrop="static">
      <Modal.Body>
        <div className="custom-modal-body">
        <Image
            src={SuccessAnimation}
            className="success-animation"
            width={150}
            alt="stamp"
            quality={100}
          />
          <h3>Offer Accepted Successfully!</h3>
        </div>
        <></>
      </Modal.Body>
      <Modal.Footer>
        <Button
          isGradient
          isFilled
          text="OK"
          onClick={handleSuccessModal}
        />
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default OfferCardBtn;