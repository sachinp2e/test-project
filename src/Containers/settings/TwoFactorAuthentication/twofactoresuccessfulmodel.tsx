import React from 'react';
import Button from '@/Components/Button';
import './style.scss';

interface ITwoFactorSuccessFully {
  toggle2FASetup: (value: boolean) => void;
}

const TwoFactorSuccessFully: React.FC<ITwoFactorSuccessFully> = ({ toggle2FASetup }) => {

  return (
    <div className="factor-success-fully">
      <div className="sub-factor-success-fully">
        <h2>2FA setup successful!</h2>
        <Button
          type="button"
          text="Ok"
          onClick={() => toggle2FASetup(false)}
          className="success-fully-btn"
        />
      </div>
    </div>
  );
};

export default TwoFactorSuccessFully;
