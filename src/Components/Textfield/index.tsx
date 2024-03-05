import React from 'react';
import './style.scss';

interface ITextFieldType {
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id?: string;
  prefix?: any;
  disabled?: boolean;
}

const TextField: React.FC<ITextFieldType> = (props) => {
  const { label, type = 'text', id, className, prefix, ...rest } = props;

  return (
    <div className="text-field">
      {
        label && (
          <div className="text-field__label">
            <label htmlFor="text-field">{label}</label>
          </div>
        )
      }
      <div className="text-field__input">
        <input type={type} id={id} className={`form-control custom-input ${className}`} {...rest} />
        {prefix}
      </div>
    </div>
  )
};

export default TextField;
