// GenericModal.tsx
import React from 'react';
import { Modal } from 'react-bootstrap';
import './modal.scss'
interface GenericModalProps {
  show: boolean;
  onHide: any;
  title: string;
  body: React.ReactNode;
  className?: string;
  close: boolean;
  size?: 'sm' | 'lg' | 'xl';
  backdrop?: 'static' | true;
}

const GenericModal: React.FC<GenericModalProps> = ({
  size,
  show,
  onHide,
  title,
  body,
  className,
  close,
  backdrop,
}) => {

  return (
    <Modal size={size} show={show} onHide={onHide} centered className={`generic-modal ${className}`} backdrop={backdrop}>
      <Modal.Header closeButton={close}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
    </Modal>
  );
};

export default GenericModal;
