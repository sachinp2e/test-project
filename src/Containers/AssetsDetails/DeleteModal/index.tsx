import React, {useCallback, useEffect, useState} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Form from 'react-bootstrap/Form';
import axiosInstance from '@/Lib/axios';
import useEffectOnce from '@/Hooks/useEffectOnce';
import Button from '@/Components/Button';
import CustomModal from '@/Components/CustomModal';
import CustomOtpScreen from '@/Components/CustomOtpScreen';
import { authSelector } from '@/Lib/auth/auth.selector';
import { useAppSelector, useAppDispatch } from '@/Lib/hooks';
import ErrImg from '@/Assets/_images/kyc-pending-failed.svg';
import './delete.scss';
import { AssetDetailSelector } from '@/Lib/assetDetail/assetDetail.selector';

interface IDeleteProps {
  showModal: boolean;
  showErrModal: boolean;
  toggleModal: (value: boolean) => void;
  toggleErrModal: (value: boolean) => void;
  assetId: string;
  isVerified: boolean;
}

const DeleteModal = ({
  showModal,
  showErrModal,
  toggleModal,
  toggleErrModal,
  assetId,
  isVerified,
}: IDeleteProps) => {
  const dispatch = useAppDispatch();
  const {AssetDetails} = useAppSelector(AssetDetailSelector);
  const [otp, setOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);
  const [errors, setErrors] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [otpResent, setOtpResent] = useState<boolean>(false);
  const [certDeleteChecked, setCertDeleteChecked] = useState<boolean>(false);
  const router = useRouter();
  

  const {
    userDetails: { email },
  } = useAppSelector(authSelector);

  const handleClose = () => {
    if (showModal) toggleModal(false);
    if (showErrModal) toggleErrModal(false);
  };

  const handleResend = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/asset/send-burn-asset-otp', {
        assetId: assetId,
      });
      if (response.data.httpStatus === 400 && response.data.customErrorNumber === 101201) {
        if (setErrors) {
          setErrors({ otpError: response.data.message });
        }
      } else if (response.data.status === 200) {
        setTimer(30);
      }
    } catch (error) {
      console.error('Invalid OTP, Please enter correct OTP:', error);
    }
  }, [dispatch]);

  useEffectOnce(() => {
    handleResend();
  });

  useEffect(()=>{
    if(otp.length < 6){
      setApiError("")
    }
  },[otp])

  const handledeleteSuccess = () => {
    handleClose();
    router.back();
  };

  const handleDeleteAsset = async () => {
    if (otp.length < 6) {
      return;
    }
    try {
      const payload:any = { id: assetId, otp, supply: 1 };
      if(certDeleteChecked){
        payload.deleteCertificate = certDeleteChecked;
      }
      const response = await axiosInstance.post('/asset/delete', payload);
      if(response.data.result.result===true){
        setShowSuccessMessage(true);
      }else {
        setApiError(response.data.result.message)
      }
    } catch (error: any) {
      if (error?.response?.data?.customErrorNumber === 9013) {
        setErrors({ otpError: error.response.data.message });
      } else if (error?.response?.data?.customErrorNumber === 100176) {
        setErrors({ otpError: error.response.data.message });
      } else {
        console.error('Unexpected error:', error);
        toggleErrModal(true);
      }
    }
  };
  const handleCheck = (e: any) => {
    setCertDeleteChecked(e.target.checked);
  };
  return (
    <>
      <CustomModal show={showModal} >
        {showSuccessMessage ? (
          <>
            <h3>Deleted Successfully</h3>
            <div className="d-flex justify-content-center mt-4">
              <Button
                isFilled
                isGradient
                text="Ok"
                onClick={handledeleteSuccess}
              />
            </div>
          </>
        ) : (
          <div className="delete-modal">
            <p className="modal-heading">Delete Asset</p>
            
              <span className="modal-descr">
                {otpResent ? "An OTP has been resent to your registered email id" : "Enter OTP sent on your registered email to delete the Asset."}
              </span>
            
            {/* <p className='mb-4'></p> */}

            <CustomOtpScreen
              setOtp={setOtp}
              otp={otp}
              timer={timer}
              setTimer={setTimer}
              setLoading={setLoading}
              email={email}
              errors={errors}
              setErrors={setErrors}
              handleResend={handleResend}
              setOtpResent={setOtpResent}
            />
            {apiError && (
              <p className="error-message text-center">{apiError}</p>
            )}
            <div className="btn-grp">
              <Button
                isFilled
                isGradient
                text="Confirm"
                onClick={handleDeleteAsset}
              />
              <Button isGradient text="Cancel" onClick={handleClose} />
            </div>
            <Form.Check
              type="checkbox"
              id={`myipr-checkbox`}
              label="Delete MyIPR certificate associated with this Asset"
              disabled={!AssetDetails?.certificateId}
              checked={certDeleteChecked}
              onChange={handleCheck}
            />
          </div>
        )}
      </CustomModal>
      <CustomModal
        show={showErrModal}
        onHide={handleClose}
        element={<Image src={ErrImg} alt="failed-img" quality={100} />}
      >
        <div className="err-body-wrapper">
          <section>
            <p>Oops!</p>
            <span>
              Some error occurred while deleting the Asset. Please try again
              after sometime.
            </span>
          </section>
          <Button isFilled isGradient text="Ok" onClick={handleClose} />
        </div>
      </CustomModal>
    </>
  );
};

export default DeleteModal;