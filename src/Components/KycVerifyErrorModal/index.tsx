import React from 'react';
import Button from '@/Components/Button';
import Image from 'next/image';
import ArrowImg from '@/Assets/_images/arrow-circle-right.svg';
import CustomModal from '@/Components/CustomModal';
import './style.scss';

interface IKycVerifyErrorModal {
  onClose: () => void;
  show: boolean;
  handleConfirm: () => void;
}

const KycVerifyErrorModal: React.FC<IKycVerifyErrorModal> = ({ onClose, show, handleConfirm }) => {
  return (
    <CustomModal show={show} onHide={onClose}>
      <div className="modal-children">
        <div className="heading">Please get KYC verified first</div>
        <div className="sub-heading">
          KYC is necessary to access all features of the platform.
        </div>
        <Button
          className="kyc-btn"
          element={
            <span>
                  Let's get started <Image src={ArrowImg} alt="" />
                </span>
          }
          isFilled
          isGradient
          onClick={handleConfirm}
        />
        <div className="skip" onClick={onClose}>
          Skip
        </div>
      </div>
    </CustomModal>
  )
};

export default KycVerifyErrorModal;
