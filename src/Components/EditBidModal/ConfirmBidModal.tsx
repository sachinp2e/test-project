import React from 'react';
import { LogoWithoutName,NavLogo,Logo } from '@/Assets/svg';
import Button from '@/Components/Button';
import { useAppSelector } from '@/Lib/hooks';
import { walletSelector } from '@/Lib/wallet/wallet.selector';
import './style.scss';

interface IConfirmBidModalProps {
  onConfirm: () => void;
}

const ConfirmBidModal: React.FC<IConfirmBidModalProps> = ({ onConfirm }) => {
  const { walletBalance } = useAppSelector(walletSelector);

  return (
    <div className="confirm-edit-bid">
      <div className="background">
        <Logo />
      </div>
      <label>Available Balance</label>
      <p>{`$${walletBalance}`}</p>
      <Button
        isFilled
        isGradient
        className="confirm-button"
        text="Confirm"
        onClick={onConfirm}
      />
    </div>
  )
};

export default ConfirmBidModal;
