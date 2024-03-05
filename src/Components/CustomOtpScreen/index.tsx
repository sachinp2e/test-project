import React, { useEffect, useState } from 'react';
import OtpInput from 'react18-input-otp';
import { StopwatchIcon } from '@/Assets/svg';
import './otpscreen.scss';

interface ICustomOtpScreen {
  setLoading: (value: boolean) => void;
  setOtp?: (value: string) => void;
  otp?: string;
  timer: number;
  setTimer: (value: any) => void;
  email?: string;
  errors?: { otpError: string };
  setErrors?: React.Dispatch<React.SetStateAction<{ otpError: string }>>;
  handleResend?: any;
  setOtpResent: (value: boolean) => void;
}

const CustomOtpScreen: React.FC<ICustomOtpScreen> = (props) => {
  const { setOtp, setLoading, otp, email, errors, setErrors, handleResend, timer, setTimer, setOtpResent } = props;
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);

  const seconds = timer % 60;
  const secondsStr = seconds < 10 ? `0${seconds}` : seconds;
  const minutes = Math.floor(timer / 60);
  const timerDisplay = `${minutes}:${secondsStr}`;

  useEffect(() => {
    if (timer > 0) {
      setResendDisabled(false);
      const intervalId = setInterval(() => {
        setTimer((prevTimer: number) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setResendDisabled(true);
    }
  }, [timer]);

  const handleResendClick = () => {
    handleResend();
    setOtpResent(true);
  };

  return (
    <div className="otp-screen-main-wrapper">
      <div className="otp-input">
        <OtpInput
          value={otp}
          onChange={(otp: string) => {
            if (setOtp) {
              setOtp(otp);
            }
            setLoading(true);
          }}
          numInputs={6}
          containerStyle="input-gap"
          isInputNum
        />
        {(errors?.otpError) ? <p className="form-error">{errors?.otpError}</p> : null}
      </div>
      <div className="reset-otp-timer">
        <div className="timer">
          {timer > 0 ? (
            <>
              <StopwatchIcon />
              <span>{timerDisplay}</span>
            </>
          ) : null}
        </div>
        <div className="reset-otp">
          <button
            className={`${resendDisabled ? 'resend-button' : 'disabled'}`}
            onClick={handleResendClick}
            disabled={!resendDisabled}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomOtpScreen;