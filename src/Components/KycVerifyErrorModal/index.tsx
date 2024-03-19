import React from 'react';
import Button from '@/Components/Button';
import Image from 'next/image';
import ArrowImg from '@/Assets/_images/arrow-circle-right.svg';
import CustomModal from '@/Components/CustomModal';
import './style.scss';
import { useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import KycInprocess from '@/Assets/_images/kyc-inprocress.svg';


interface IKycVerifyErrorModal {
  onClose: () => void;
  show: boolean;
  handleConfirm: () => void;
}

const KycVerifyErrorModal: React.FC<IKycVerifyErrorModal> = ({
  onClose,
  show,
  handleConfirm,
}) => {
  const {
    userDetails: { kycStatus },
  } = useAppSelector(authSelector);
  return (
    <CustomModal show={show} onHide={onClose}>
      <div className="modal-children">
      {kycStatus === 'INPROCESS' && <Image src={KycInprocess} alt='' width={200} height={200}/>}
        <div className="heading">
          {kycStatus === 'INPROCESS'
            ? 'Your KYC is under process'
            : 'Please get KYC verified first'}
        </div>
        <div className="sub-heading">
          {kycStatus === 'INPROCESS'
            ? 'It will take 24-48 hours to update your KYC status.'
            : 'KYC is necessary to access all features of the platform.'}
        </div>
          <Button
            className="kyc-btn"
            element={
              <span>
               {kycStatus === 'INPROCESS' ? 'Close' : `Let's get started `}
              {kycStatus !== 'INPROCESS' && <Image src={ArrowImg} alt="" />}

              </span>
            }
            isFilled
            isGradient
            onClick={handleConfirm}
          />
        {kycStatus !== 'INPROCESS' && <div className="skip" onClick={onClose}>
          Skip
        </div>}
      </div>
    </CustomModal>
  );
};

export default KycVerifyErrorModal;
