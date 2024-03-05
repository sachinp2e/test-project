import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Input from '@/Components/Input/Input';
import Button from '@/Components/Button';
import axiosInstance from '@/Lib/axios';
import { toastSuccessMessage } from '@/utils/constants';

interface IVerifyEmailModal {
  onHide: () => void;
}

const VerifyEmailModal: React.FC<IVerifyEmailModal> = ({ onHide }) => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<null | string>(null);

  const onEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const resendEmail = async () => {
    try {
      const payload = { email };
      const response = await axiosInstance.post('/user/resend-email-otp', payload);
      if (response.data.result) {
        toastSuccessMessage('Email sent successfully');
        router.push(`/otp?email=${email}`);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response.data?.message);
    }
  };

  return (
    <Modal show centered onHide={onHide} className="verify-email-modal">
      <Modal.Header closeButton>
        <Modal.Title>Verify Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Please verify your email address
        </p>
        <Input name="verifyEmail" placeholder="Enter Email Address" onChange={onEmailChange} value={email} />
        {
          error && <p className="error">{error}</p>
        }
        <Button
          isFilled
          isGradient
          onClick={resendEmail}
          text="Send Verification Email"
          className="verification-email-button"
        />
      </Modal.Body>
    </Modal>
  )
};

export default VerifyEmailModal;
