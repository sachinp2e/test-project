import React from 'react';
import CustomSelect, { IOption } from '@/Components/CustomSelect';
import InputField from '@/Components/Input/Input';
import './selectInput.scss';

interface ISelectInputProps {
  label: string;
  labelTwo: string;
  dropdownValue?: string;
  handleCurrencyChange: (key: string, selectedOption: IOption) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: IOption[];
  name: string;
  value?: string | number;
  placeholder?:string;
  type?: 'TEXT' | 'NUMBER';
}

const SelectInput: React.FC<ISelectInputProps> = ({
  label,
  labelTwo,
  handleChange,
  name,
  value,
  type,
}) => {
  return (
    <div className="select-input-container">
      <label htmlFor="">{label}</label>
      <div className="select-input">
        {/*<CustomSelect*/}
        {/*  placeholder={placeholder}*/}
        {/*  onChange={handleCurrencyChange}*/}
        {/*  options={options}*/}
        {/*  name="currencyId"*/}
        {/*  value={dropdownValue || ''}*/}
        {/*  className="selectCurrency"*/}
        {/*/>*/}
        <div className="selectCurrency px-3">USD</div>
        <InputField
          label=""
          name={name}
          type={type}
          placeholder="Enter Price"
          className="currencyInput"
          value={value}
          onChange={handleChange}
        />
      </div>
      <span className="info-label">{labelTwo}</span>
    </div>
  );
};

export default SelectInput;
