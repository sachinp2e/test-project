// InputField.tsx
import React from 'react';
import './InputField.scss';

interface InputFieldProps {
  label?: string;
  name: string;
  type?: 'TEXT' | 'NUMBER';
  placeholder: string;
  className?: string;
  spanText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'TEXT',
  placeholder,
  className,
  spanText,
  onChange,
  value,
}) => {
  const onLocalChange = (e: any) => {
    // If type is number, only allow positive numbers
    if (type === 'NUMBER') {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        onChange && onChange(e);
      }
    } else {
      onChange && onChange(e);
    }
  };
  return (
    <div className={`input-field-container ${className || ''}`}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <input
        name={name}
        onChange={onLocalChange}
        value={value}
        placeholder={placeholder}
      />
      {spanText && <span className="span-text">{spanText}</span>}
    </div>
  );
};

export default InputField;
