import React from 'react';
import ToggleSwitch from '@/Components/ToggleSwitch';
import OtpModal from './otpmodel';
import VerifyModal from './verificatiomodel';
import GenericModal from '../../../Components/modal/index';
import TwoFactorSuccessFully from './twofactoresuccessfulmodel';
import { StarInfo } from '../../../Assets/svg';
import './style.scss';

interface ITwoFactorAuthentication {
}

const TwoFactorAuthentication: React.FC<ITwoFactorAuthentication> = () => {
  const [is2FAEnabled, toggle2FAEnabled] = React.useState<boolean>(false);
  const [is2FAOtpEnabled, toggle2FAOtpEnabled] = React.useState<boolean>(false);
  const [is2FASetup, toggle2FASetup] = React.useState<boolean>(false);

  const onToggleChange = () => {
    toggle2FAEnabled(!is2FAEnabled);
  };

  const handleSuccessVerify = () => {
    toggle2FAEnabled(false);
    toggle2FAOtpEnabled(true);
  };

  const handleProceedSetup = () => {
    toggle2FAOtpEnabled(false);
    toggle2FASetup(prevState => !prevState);
  };

  return (
    <>
      <div  className="two-factor-authentication-page">
        <div className="heading">
          <h3>Manage your 2FA verification settings</h3>
          <div className="divider" />
        </div>
        <div className="two-factor-main-wrapper">
          <div className="two-factor-authentication">
            <div className="two-factor-authentication__left">
              <p>Enable 2FA</p>
              <p>Enable 2FA will provide you to verify your phone number to proceed</p>
            </div>
            <div className="two-factor-authentication__right">
              <ToggleSwitch onChange={onToggleChange} />
            </div>
          </div>
          <div className="alert-wrapper">
            <div className="icon">
              <StarInfo />
            </div>
            <div className="text">
              Two-Factor Authentication adds an extra layer of security to your login process by requiring
              two forms of identification. An OTP will be sent to your registered mobile number every time
              you login to prevent unauthorized access.
            </div>
          </div>
        </div>
      </div>
      
      <GenericModal
        title=""
        close={true}
        show={is2FAEnabled}
        className="verify-modal"
        onHide={toggle2FAEnabled}
        body={<VerifyModal SuccessVerify={handleSuccessVerify} />}
      />
      <GenericModal
        title=""
        close={true}
        className="otp-modal"
        show={is2FAOtpEnabled}
        onHide={toggle2FAOtpEnabled}
        body={<OtpModal ProceedSetup={handleProceedSetup} />}
      />
      <GenericModal
        title=""
        close={true}
        className="proceed-setup-modal"
        show={is2FASetup}
        onHide={toggle2FASetup}
        body={<TwoFactorSuccessFully toggle2FASetup={toggle2FASetup} />}
      />
    </>
  );
};

export default TwoFactorAuthentication;
