'use client';
import React, { useEffect, useMemo, useState } from 'react';
import 'dotenv/config';
import { Provider } from 'mai-kyc-aggregator';
import { COUNTRIES } from './countries';
import { Modal } from 'react-bootstrap';
import righArrow from '@/Assets/_images/arrow-circle-right.svg';
import Image from 'next/image';
import '../CustomModal/custom-modal.scss';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getProfileAction } from '@/Lib/auth/auth.action';
import { authSelector } from '@/Lib/auth/auth.selector';
import { logout } from '@/Lib/auth/auth.slice';
import Button from '../Button';
import './verify-kyc.scss';
interface Iprops {
  showKycModal: boolean;
  toggleKycModal: (value: boolean) => void;
}

const header = {
  'x-api-key':
    '832d87bb962f0db2803c89ba4b105f41981428aa8b2b4bd220789087bb7e10a5ab8285728e6c43b52998f81b059b5c3785973385318655e5d4621effce204558',
  environment_url: `https://stg-kycapi.p2eppl.com/v1`,
};

const VerifyKycModal = ({ showKycModal, toggleKycModal }: Iprops) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector(authSelector);
  const [showKyc, toggleKyc] = useState(false);
  const [payload, setPayload] = useState<any>();
  const [kycResponse, setKycResponse] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [isKycProcressInitiated,setIsKycProcessInitiated] = useState<boolean>(false);

  const handleInitateKyc = async () => {
    if (!selectedCountry) {
      return;
    }
    toggleKyc(false);
    try {
      if (!payload?.userId) {
        await setupPayload();
      }
      setPayload((prev: any) => {
        return {
          ...prev,
          nationality: selectedCountry.value,
        };
      });
      localStorage.setItem('kycProcess', 'initiated');
      toggleKyc(true);
    } catch (err: any) {}
  };
  useEffect(() => {
    // Check if KYC process is initiated
    const kycProcess = localStorage.getItem('kycProcess');
    setIsKycProcessInitiated(kycProcess === 'initiated');
  }, []);

  useEffect(() => {
    if (kycResponse?.status === 'PENDING' && payload.userId) {
      return toggleKycModal(false);
    }
    if (
      kycResponse?.reviewStatus === 'completed' &&
      kycResponse?.reviewResult?.reviewAnswer === 'GREEN'
    ) {
      dispatch(getProfileAction());
    }
  }, [kycResponse]);

  const setupPayload = async () => {
    if (!userDetails?.id) {
      dispatch(logout());
      router.push('/login');
    }
    try {
      if (userDetails?.kycStatus === 'COMPLETED') {
        return toggleKycModal(false);
      }
      setPayload({
        userId: userDetails?.id,
        firstName: userDetails?.firstName,
        lastName: userDetails?.lastName,
        mobile_no: userDetails?.mobileNumber || '8425928181',
        email: userDetails?.email,
        redirect_back_url: window?.location?.origin || process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || 'https://dev-nftm.p2eppl.com',
        type: 'KYC',
        nationality: selectedCountry.value,
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  const ErrorMessage = useMemo(() => {
    if (kycResponse?.response?.status === 400) {
      return 'Something went wrong! Please try again later.';
    }
  }, kycResponse);

  const handleSkipKYC =()=>{
    toggleKycModal(false)
  }

  return (
    <>
      <Modal
        show={showKycModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal-container"
      >
        <Modal.Body>
          {ErrorMessage ? (
            <>
              <div className="title mb-4">{ErrorMessage}</div>
              <button
                className={`modal-main-btn image-btn`}
                onClick={() => toggleKycModal(false)}
              >
                Back
              </button>
            </>
          ) : (
            <>
                {showKyc ? (
                  <>
                    <Provider
                      payload={payload}
                      headers={header}
                      setKycResponse={setKycResponse}
                    />
                    {isKycProcressInitiated ? (
                      <div className="skip-kyc">
                        <span>
                          KYC process is already in progress.
                        </span>
                        <Button
                          onClick={handleSkipKYC}
                          className="mt-4"
                          isFilled
                          isGradient
                          element={
                            <>
                              Close
                            </>
                          }
                        />
                      </div>
                    ) : (
                      <div className="skip" onClick={() => toggleKycModal(false)}>
                        <span>Redirecting to KYC Process</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="kyc-modal-children">
                    <div className="title mb-4 ">
                      Select your country to initiate KYC
                    </div>
                    <Select
                      defaultValue={selectedCountry}
                      onChange={setSelectedCountry}
                      options={COUNTRIES}
                      className="w-100"
                    />
                    <div className="button-group">
                      <Button
                        element={
                          <span>
                            Complete KYC <Image src={righArrow} alt="" />
                          </span>
                        }
                        className="mt-4"
                        isFilled
                        isGradient
                        onClick={handleInitateKyc}
                      />
                      <div className="skip" onClick={() => toggleKycModal(false)}>
                        <span>Close</span>
                      </div>
                    </div>
                  </div>
                )}

            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VerifyKycModal;
