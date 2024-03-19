import React, { useMemo } from 'react';
import { LogoWithoutName, NavLogo, Logo } from '@/Assets/svg';
import Button from '@/Components/Button';
import { useAppSelector } from '@/Lib/hooks';
import { walletSelector } from '@/Lib/wallet/wallet.selector';
import './style.scss';
import AddFunds from '@/Containers/settings/MyWallet/AddFunds';
import Image from 'next/image';
import LogoIcon from '@/Assets/_images/Logo_Icon.svg';

interface IConfirmBidModalProps {
  onConfirm: () => void;
  amount: number;
}

const ConfirmBidModal: React.FC<IConfirmBidModalProps> = ({
  onConfirm,
  amount,
  
}) => {
  const { walletBalance } = useAppSelector(walletSelector);
  const inSufficientFunds = useMemo(() => {
    return walletBalance < amount;
  }, [walletBalance, amount]);
  return (
    <div className="confirm-edit-bid">
      <div className="background">
        <Image
          src={LogoIcon}
          alt='icon image'
          width={250}
          height={250}
        />
      </div>
      <label>Available Balance</label>
      <p style={{ color: "#02c715" }}>{`$${walletBalance}`}</p>
      {inSufficientFunds ? (
        <>
        <span className="error-message my-4">Insufficient Funds</span>
        <AddFunds />
        </>
      ) : (
        <Button
          isFilled
          isGradient
          className="confirm-button mb-4"
          text="Confirm"
          onClick={onConfirm}
          disabled={inSufficientFunds}
        />
      )}
    </div>
  );
};

export default ConfirmBidModal;
