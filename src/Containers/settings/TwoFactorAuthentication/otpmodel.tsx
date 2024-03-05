import React, {useCallback, useState} from 'react';
import Button from '@/Components/Button';
import CustomOtpScreen from '@/Components/CustomOtpScreen/index';
import './style.scss';

interface IOtpModal {
  ProceedSetup: () => void;
}

const OtpModal: React.FC<IOtpModal> = ({ ProceedSetup }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);
  const [errors, setErrors] = useState<any>('');
  const [otpResent, setOtpResent] = useState<boolean>(false);

  const handleResend = ()=>{
    alert("working progress...")
  }

  return (
    <div className="otp-modal-main-wrapper">
      <div className="enter-otp-title">
        <h3>Enter OTP</h3>
        <p>
                {otpResent ? "An OTP has been resent to your registered email id" : "Enter OTP sent on your registered email to delete the Asset."}
        </p>
      </div>
      <div>
        <CustomOtpScreen
          otp={otp}
          setOtp={setOtp}
          setLoading={setLoading}
          timer={timer}
          setTimer={setTimer}
          errors={errors}
          setErrors={setErrors}
          handleResend={handleResend}
          setOtpResent={setOtpResent}
        />
      </div>
      <div className="proceed-btn-container">
        <Button
          type="button"
          text="Proceed"
          onClick={ProceedSetup}
          className="proceed-otp-btn"
        />
      </div>
    </div>
  );
};

export default OtpModal;