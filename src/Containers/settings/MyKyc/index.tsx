import React, { useMemo, useState } from 'react';
import Button from '../../../Components/Button';
import ArrowBtnImg from '../../../Assets/_images/arrow-circle-right.svg';
import KycPendingFailed from '../../../Assets/_images/kyc-pending-failed.svg';
import KycInprocess from '../../../Assets/_images/kyc-inprocress.svg';
import KycCompleted from '../../../Assets/_images/kyc-completed.svg';
import './style.scss';
import { useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import VerifyKycModal from '@/Components/VerifyKycModal/page';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { InfoIcon } from '@/Assets/svg';

interface IMyKyc {}

const MyKyc: React.FC<IMyKyc> = () => {
  const [showKycModal, toggleKycModal] = useState<boolean>(false);
  const {
    userDetails: { kycStatus },
  } = useAppSelector(authSelector);

  const isKycProcessInitiated = useMemo(() => {
    const kycProcess = localStorage.getItem('kycProcess');
    if (kycStatus !== 'VERIFIED' && kycStatus !== 'FAILED') {
      return kycProcess === 'initiated';
    }
    return false;
  }, []);

  const handleKycButton = () => {
    if (kycStatus !== 'VERIFIED') {
      toggleKycModal(true);
    }
  };

  const {
    imageSrc,
    text3,
    action,
    text1,
    text2,
  }: {
    imageSrc: string | StaticImport;
    text3: string;
    action?: string;
    text1: string;
    text2: string;
  } = useMemo(() => {
    let text1 = '';
    let text2 = '';
    let text3 = '';
    let action = '';
    let imageSrc = KycPendingFailed;

    // const isKycProcessInitiated = localStorage.getItem('kycProcess') === 'initiated';

    if (isKycProcessInitiated && kycStatus != 'VERIFIED') {
      text1 = '';
      text2 = 'Your KYC in progress! ⏳';
      text3 = 'KYC status will be updated in 24-48 hours';
      imageSrc = KycInprocess;
    } else {
      switch (kycStatus) {
        case 'VERIFIED':
          text1 = 'Congratulations!';
          text2 = 'You are all set up!';
          text3 = 'Your KYC is complete. Enjoy full access to the platform!';
          imageSrc = KycCompleted;
          break;
        case 'INPROCESS':
          text1 = '';
          text2 = 'Your KYC in progress! ⏳';
          text3 = 'KYC status will be updated in 24-48 hours';
          imageSrc = KycInprocess;
          break;
        case 'PENDING':
          text1 = 'Oops!';
          text2 = 'Your KYC is pending!';
          text3 = 'KYC is necessary to access all features of the platform.';
          action = `Start KYC`;
          imageSrc = KycPendingFailed;
          break;
        case 'FAILED':
          text1 = 'Oops!';
          text2 = 'Attempt unsuccessful!';
          text3 = 'Your KYC is rejected!';
          action = `Start KYC`;
          imageSrc = KycPendingFailed;
          break;
        default:
          text1 = 'Oops!';
          text2 = 'Your KYC is pending!';
          text3 = 'KYC is necessary to access all features of the platform.';
          action = `Start KYC`;
          imageSrc = KycPendingFailed;
          break;
      }
    }

    return { text1, text2, text3, action, imageSrc };
  }, [kycStatus]);

  return (
    <div className="kyc-status-page">
      <div className="kyc-header align-items-center">
        <span>KYC Status </span>
        {isKycProcessInitiated && (
          <button className="kyc-status-button-inprogress">In Progress</button>
        )}
        {!isKycProcessInitiated && kycStatus && (
          <button className={`kyc-status-button ${kycStatus?.toLowerCase()}`}>
            {kycStatus === 'VERIFIED' && 'Complete'}
            {kycStatus === 'INPROCESS' && 'In Progress'}
            {kycStatus === 'PENDING' && 'Incomplete'}
            {kycStatus === 'initiated' && 'In Progress'}
            {kycStatus === 'FAILED' && 'Rejected'}
          </button>
        )}
      </div>
      <div className="kyc-body">
        {imageSrc && <Image src={imageSrc} alt={`kyc ${kycStatus} image`} />}
        {text1 && <span className="kyc-text1">{text1}</span>}
        {text2 && <span className="kyc-text2"> {text2}</span>}
        {text3 && (
          <span className="kyc-text3">
            <InfoIcon /> {text3}
          </span>
        )}
        {action && (
          <Button
            className={`start-kyc-btn ${
              kycStatus !== 'COMPLETED' ? '' : 'disable-btn'
            }`}
            element={
              <div className="d-flex align-items-center">
                <span className="me-2">{action}</span>
                <Image src={ArrowBtnImg} alt="arrow" />
              </div>
            }
            onClick={() => handleKycButton()}
            disabled={kycStatus === 'COMPLETED'}
            isFilled
            isGradient
          />
        )}
      </div>
      {showKycModal && (
        <VerifyKycModal
          showKycModal={showKycModal}
          toggleKycModal={toggleKycModal}
        />
      )}
    </div>
  );
};
export default MyKyc;
