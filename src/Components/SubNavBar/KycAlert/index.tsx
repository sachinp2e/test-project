import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import warningLogo from '@/Assets/warning.svg';
import { CancleIcon } from '@/Assets/svg';
import { useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';

type Props = { kycStatus: string; toggleKycModal: (value: boolean) => void };

const KycAlert = ({ kycStatus, toggleKycModal }: Props) => {
  const [showAlert, setShowAlert] = useState(true);

  const isKycProcessInitiated = useMemo(() => {
    const kycProcess = localStorage.getItem('kycProcess');
    if (kycStatus !== 'VERIFIED' && kycStatus !== 'FAILED') {
      return kycProcess === 'initiated';
    }
    return false;
  }, []);

  const { message, action }: { message: string; action?: string } =
    useMemo(() => {
      let message = '';
      let action = '';

      const isPending = kycStatus === 'PENDING';
      const isFailed = kycStatus === 'FAILED';

      if (isPending) {
        message = 'KYC is necessary to access all features of the platform.';
        action = `Complete KYC`;
      } else if (isFailed) {
        message = ` KYC Verification failed.`;
        action = `Retry KYC`;
      } else {
        message = `KYC is in progress. It will updated in 24-48 hours.`;
      }
      return { message, action };
    }, [kycStatus]);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  return (
    <>
      {showAlert && (
        <div className="kyc-toast-top">
          <div className="kyc-toast-container">
            <Image
              src={warningLogo}
              alt="close-icon"
              width={100}
              height={100}
              style={{ width: '20px', height: 'auto' }}
            />
            <span className="kyc-message">
              {isKycProcessInitiated
                ? 'KYC is in progress. It will updated in 24-48 hours.'
                : message}{' '}
            </span>
            {action && (
              <span
                className="complete-kyc"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleKycModal(true)}
              >
                {action}
              </span>
            )}
            <span
              style={{ cursor: 'pointer' }}
              onClick={handleCloseAlert}
              className="cancle-icon-container"
            >
              <CancleIcon />
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default KycAlert;
