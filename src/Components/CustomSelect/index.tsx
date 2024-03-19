'use client';
import React, { useEffect, useRef, useState } from 'react';
import { DownArrowSVG } from '@/Assets/svg';
import './custom-select.scss';

export interface IOption {
  id?: number | string;
  value: string;
  label: string | JSX.Element;
}

interface ICustomSelectProps {
  name?: string;
  className?: string;
  value?: string | number | undefined;
  onChange: (name: string, option: IOption) => void;
  placeholder?: string | React.ReactNode;
  label?: string | JSX.Element | React.ReactNode;
  options: IOption[];
  fix?: boolean;
}

const CustomSelect: React.FC<ICustomSelectProps> = (props) => {
  const {
    name,
    className,
    value,
    onChange,
    placeholder = 'Select an option',
    options,
    label,
    fix=false
  } = props;

  const selectRef = useRef<HTMLDivElement>(null);

  const [selectedOption, setSelectedOption] = useState<string | number |undefined>(
    value,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (fix) setSelectedOption(value);
  }, [value])
  
  const handleOptionSelect = (option: IOption) => {
    if (!fix) {
      setSelectedOption(option.value);
    }
    setIsDropdownOpen(false);
    onChange(name as string, option);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {label && (
        <label htmlFor="" className="pb-1 custom-label">
          {label}
        </label>
      )}
      <div ref={selectRef} className={`custom-select ${className}`}>
        <div
          className="selected-item"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {value ? (
            <span className="select-placeholder">
              {options.find((o) => o.value === selectedOption)?.label}
            </span>
          ) : (
            <span
              className="select-placeholder"
            >
              {placeholder}
            </span>
          )}
          <span className={`${isDropdownOpen ? 'arrow-up' : 'arrow-down'}`}>
            <DownArrowSVG />
          </span>
        </div>
        <div className={` ${isDropdownOpen ? 'options-container' : 'hide'}`}>
          {options.length > 0 ? (
            <ul className="options-list">
              {options?.map((option) => (
                <li
                  style={{ whiteSpace: 'nowrap' }}
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          ) : (
            <ul className="options-list">
              <li className="d-flex justify-content-center">No Data</li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomSelect;
