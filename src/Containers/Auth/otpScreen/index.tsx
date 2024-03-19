'use client';
import React, { useCallback, useState } from 'react';
import Carousel from '@/Containers/Auth/Carousel';
import { useRouter, useSearchParams } from 'next/navigation';
import { Col, Row } from 'react-bootstrap';
import CustomModal from '@/Components/CustomModal';
import CustomOtpScreen from '@/Components/CustomOtpScreen';
import { otpAction } from '@/Lib/auth/auth.action';
import { authSelector } from '@/Lib/auth/auth.selector';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { resendAction } from '@/Lib/auth/auth.action';
import Button from '@/Components/Button';
import { LoginLogo } from '@/Assets/svg';
import '../Signup/signup.scss';
import '../auth.scss';
import {  toastSuccessMessage } from '@/utils/constants';
import Link from 'next/link';

interface IOtpScreenType {}

const OtpScreen: React.FC<IOtpScreenType> = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);
  const [errors, setErrors] = useState<any>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const otpVerify = useAppSelector(authSelector);
  const [otpResent, setOtpResent] = useState<boolean>(false);
  const [isBlocked,setIsBlocked] = useState<boolean>(false);

  const handleOtp = useCallback(async (otp: string) => {
    try {
      //@ts-ignore
      const data: any = await dispatch(otpAction({ otp, email }));
      if (data.payload.httpStatus === 400 && data.payload.customErrorNumber === 9013) {
        setErrors({ otpError: data.payload.message });
      } else if (data.payload.status === 200) {
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Invalid OTP, Please enter correct OTP:', error);
    }
  }, [dispatch, email]);


  const handleResend = useCallback(async () => {
    try {
      //@ts-ignore
      const data: any = await dispatch(resendAction({ email }));
      if (data.payload.httpStatus === 400 && data.payload.customErrorNumber === 101201) {
        if (setErrors) {
          setErrors({ otpError: data.payload.message });
        }
      }else if (data.payload.httpStatus === 400 && data.payload.customErrorNumber === 9015) {
        if (setErrors) {
          setIsBlocked(true);
          setErrors({ otpError: data.payload.message });
        }
      } else if (data.payload.status === 200) {
        setTimer(30);
        toastSuccessMessage(
          'OTP send sucessfully!',
        );
      }
    } catch (error) {
      console.error('Invalid OTP, Please enter correct OTP:', error);
    }
  }, [dispatch]);
  console.log(errors)
  return (
    <>
      <Row className="m-0 auth-container">
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="carousel-screen p-0 align-self-center">
          <Carousel />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="otp p-0 align-self-center">
          <div className="otp-main-container">
            <Link href={'/'} className="logo">
              <LoginLogo />
            </Link>
            <div className="heading-container">
              <div className="heading">Enter OTP</div>
              <span className="sub-heading">
                {otpResent ? "An OTP has been resent to your registered email id" : "Please enter 6 digit OTP received on the Email Address"}
              </span>
            </div>
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

            <div>
              <button
                className="otp-btn"
                onClick={() => handleOtp(otp || '')}
                disabled={!loading|| isBlocked}
              >
                {otpVerify.otpVerifyLoading &&  <span className="loader" />}
                Proceed
              </button>
            </div>
          </div>
        </Col>
      </Row>
      {modalOpen &&
      <CustomModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
      >
        <div className="signup-modal">
          <div className="heading">Signed up Successfully!</div>
          <div className="sub-heading">You can also login to MyIPR with the same credentials to certify your assets.</div>
          <Button
            text="Login now"
            onClick={() => router.push('/login')}
            className="signup-modal-btn filled"
          />
        </div>
      </CustomModal>
      }
    </>
  );
};

export default OtpScreen;