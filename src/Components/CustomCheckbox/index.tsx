import React from 'react';
import './checkbox.scss'

interface ICustomCheckbox {
  isChecked: boolean,
  onChange: () => void,
  className?:string,
}

const CustomCheckbox:React.FC<ICustomCheckbox> = ({ isChecked, onChange, className }) => {
  return (
    <div className="custom-checkbox">
      <input
        className={`checkbox ${className}`}
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomCheckbox;
