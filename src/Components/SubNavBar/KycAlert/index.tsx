import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import warningLogo from '@/Assets/warning.svg';
import { CancleIcon } from '@/Assets/svg';

type Props = { kycStatus: string; toggleKycModal: (value: boolean) => void };



const KycAlert = ({ kycStatus, toggleKycModal }: Props) => {
  const [showAlert,setShowAlert] =useState(true)

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
        message = `KYC is in progress.`;
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
          <Image
            src={warningLogo}
            alt="close-icon"
            width={100}
            height={100}
            style={{ width: '20px', height: 'auto' }}
          />
          <span className='kyc-message'>{message}{' '}</span>
          {action && (
            <>
              <span className="complete-kyc" onClick={() => toggleKycModal(true)}>{action}</span>
              <span onClick={handleCloseAlert}  className="cancle-icon-container">
                <CancleIcon/>
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default KycAlert;
