import React from 'react';
import { Modal } from 'react-bootstrap';
import './custom-modal.scss';

interface IModalType {
  children: React.ReactNode;
  animation?: any;
  show?: boolean;
  element?: React.ReactNode;
  onHide?: () => void;
}

const CustomModal: React.FC<IModalType> = (props) => {
  const { children, onHide, show, element, animation, ...rest } = props;

  return (
    <>
      <Modal
        size="lg"
        centered
        show={show}
        onHide={onHide}
        {...rest}
        className="modal-container"
      >
        <Modal.Header>
          {animation ? animation : element}
        </Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomModal;
