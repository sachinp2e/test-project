// TODO: Make this component a generic component with all rich features of a radio button

import React from 'react';
import { Form } from 'react-bootstrap';
import './style.scss';

type IOption = {
  id?: number;
  label: string;
  value: string;
};

interface IRadioGroupProps {
  label: string;
  options: IOption[];
  name: string;
  onChange: (selectedOption: string) => void;
  value?: string;
}

const RadioButton: React.FC<IRadioGroupProps> = (props) => {
  const {
    label,
    options,
    name,
    onChange,
    value,
  } = props;

  const handleOptionChange = (option: string) => {
    onChange(option);
  };

  return (
    <Form.Group controlId={`formRadio ${label}`} className="radio-label">
      <Form.Label>{label}</Form.Label>
      <div className="custom-radio">
        {options.map((option) => (
          <Form.Check
            key={option.value}
            name={name}
            className="custom-radio-input"
            type="radio"
            id={`radio ${option.value}`}
            label={option.label}
            checked={value === option.value}
            onChange={() => handleOptionChange(option.value)}
          />
        ))}
      </div>
    </Form.Group>
  );
};

export default RadioButton;
