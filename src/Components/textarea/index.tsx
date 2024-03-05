// GenericTextArea.tsx
import React, { ChangeEvent } from 'react';
import './GenericTextArea.scss';

interface TextAreaProps {
  label: string;
  name: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?:boolean
}

const GenericTextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows,
  className,disabled

}) => (
  <div className={`text-area-container ${className || ''}`}>
    <label htmlFor={name}>{label}</label>
    <textarea
      disabled={disabled}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
    />
  </div>
);

export default GenericTextArea;
