import React, { useState } from 'react';
import VerifyKycModal from '@/Components/VerifyKycModal/page';
import KycVerifyErrorModal from '@/Components/KycVerifyErrorModal';
import { useAppSelector } from '../../Lib/hooks';
import { authSelector } from '../../Lib/auth/auth.selector';
import './button.scss';
import { useRouter } from 'next/navigation';

interface IButton {
  key?: string | number;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  text?: string;
  element?: React.ReactNode;
  type?: 'submit' | 'reset' | 'button',
  disabled?: boolean;
  isGradient?: boolean;
  isFilled?: boolean;
  name?: string;
  image?: any;
  isLoading?: boolean;
  onlyVerifiedAccess?: boolean;
}

const Button: React.FC<IButton> = (props) => {
  const router = useRouter();
  const {
    key,
    className,
    text,
    onClick,
    element,
    type = 'button',
    isGradient = false,
    isFilled = false,
    disabled = false,
    isLoading = false,
    onlyVerifiedAccess = false,
    ...rest
  } = props;

  const { userDetails } = useAppSelector(authSelector);

  const [showAuthorizedModal, toggleAuthorizedModal] = useState<boolean>(false);
  const [kycVerificationModal, toggleKycVerificationModal] = useState<boolean>(false);

  const localOnClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onlyVerifiedAccess && !userDetails.id) {
      router.push('/login');
    } else if (onlyVerifiedAccess && !userDetails?.isKycVerified) {
      toggleAuthorizedModal(true);
    } else {
      onClick?.(e);
    }
  };

  const onHandleConfirm = () => {
    if(userDetails?.kycStatus === 'INPROCESS'){
      return toggleAuthorizedModal(false);
    }
    toggleAuthorizedModal(false);
    toggleKycVerificationModal(true);
  };

  const renderButtonFromType = () => {
    if (isGradient && !isFilled) {
      return (
        <div className={`custom-gradient-button ${className || ''}`}>
          <button
            type={type}
            className={` link-style ${disabled ? 'disabled' : ''}`}
            disabled={disabled || isLoading}
            onClick={localOnClick}
            {...rest}
          >
          <span className="link-span">
          {
            isLoading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : element ? element : text
          }
          </span>
          </button>
        </div>
      );
    } else if (isGradient && isFilled) {
      return (
        <button
          className={`custom-gradient-button-filled ${disabled ? 'disabled' : ''} ${className || ''}`}
          disabled={disabled || isLoading}
          onClick={localOnClick}
          {...rest}
        >
          <div className="d-flex align-items-center">
            {
              isLoading ? (
                <span className="loader loader-small me-2" />
              ) : null
            }
            {element ? element : text}
          </div>
        </button>
      );
    } else {
      return <div className="custom-button">
        <button
          type={type}
          key={key}
          disabled={disabled || isLoading}
          className={`button-wrapper ${className}`}
          onClick={localOnClick}
          {...rest}
        >
          {
            element ? element : <div className="text">{text}</div>
          }
        </button>
      </div>
    }
  };


  return (
    <>
      {
        showAuthorizedModal && (
          <KycVerifyErrorModal
            onClose={() => toggleAuthorizedModal(false)}
            show={showAuthorizedModal}
            handleConfirm={onHandleConfirm}
          />
        )
      }
      {
        kycVerificationModal && (
          <VerifyKycModal
            toggleKycModal={() => toggleKycVerificationModal(false)}
            showKycModal={kycVerificationModal}
          />
        )
      }
      {renderButtonFromType()}
    </>
  );
};

export default Button;
