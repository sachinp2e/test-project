'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import Modal from 'react-bootstrap/Modal';
import Button from '@/Components/Button';
import SuccessAnimation from '@/Assets/_images/sucess-animation.gif';
import { Warning } from '@/Assets/svg';
import './style.scss';

interface IResultModalProps {
  type: 'SUCCESS' | 'FAILURE';
  hideAnimation?: boolean;
  text: string;
  description?: string;
  onProceed: () => void;
}

const ResultModal: React.FC<IResultModalProps> = ({ type, text, description, onProceed, hideAnimation = false }) => {
  const renderIcon = useCallback(() => {
    switch (type) {
      case 'SUCCESS':
        return (
          <Image
            src={SuccessAnimation}
            className="success-animation"
            width={150}
            alt="stamp"
            quality={100}
          />
        );
      case 'FAILURE':
        return (
          <Warning />
        );
      default:
        return null;
    }
  }, [type]);
  return (
    <Modal show className="result-modal" centered backdrop="static">
      <Modal.Body>
        <div className="custom-modal-body">
          {!hideAnimation && renderIcon()}
          <h3 className={hideAnimation || type === 'SUCCESS' ? '' : 'mt-0'}>{text}</h3>
          {description && <p className="px-3">{description}</p>}
        </div>
        <></>
      </Modal.Body>
      <Modal.Footer>
        <Button
          isGradient
          isFilled
          text="OK"
          onClick={onProceed}
        />
      </Modal.Footer>
    </Modal>
  )
};

export default ResultModal;
