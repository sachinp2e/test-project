import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from '@/Components/Button';
import './style.scss';

interface IVerifyModal {
  SuccessVerify: () => void;
}

interface DropdownOptions {
  country: string,
  value: string,
}

const dropdownOptions: DropdownOptions[] = [
  {
    country: 'IN',
    value: '+91',
  },
  {
    country: 'UK',
    value: '+92',
  },
  {
    country: 'US',
    value: '+93',
  },
];

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Number is required'),
});

const VerifyModal: React.FC<IVerifyModal> = ({ SuccessVerify }) => {
  const [selectedCountry, setSelectedCountry] = useState<DropdownOptions>(dropdownOptions[0]);

  const formic = useFormik({
    initialValues: {
      phone: '',
    },
    validationSchema,
    onSubmit: (values) => {
      SuccessVerify();
    },
  });

  return (
    <Form onSubmit={formic.handleSubmit} className="verify-modal-main-wrapper">
      <div className="verify-modal-title">
        Please verify your phone no. to proceed
      </div>
      <div className="number-verify-input">
        <InputGroup>
        
          <Form.Control
            type="text"
            name="phone"
            aria-label="Text input with dropdown button"
            placeholder={`${selectedCountry.value} Phone`}
            onChange={formic.handleChange}
            value={formic.values.phone.trim()}
          />
        </InputGroup>
        {formic.touched.phone && formic.errors.phone && (
          <div className="tel-error-message">{formic.errors.phone}</div>
        )}
      </div>
      <div className="otp-btn-container">
        <Button
          type="submit"
          text="Send OTP"
          className="send-otp-btn"
        />
      </div>
    </Form>
  );
};
export default VerifyModal;
