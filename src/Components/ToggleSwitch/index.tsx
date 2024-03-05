import React from 'react';
import Image from 'next/image';
import SuccessIcon from '../../Assets/_images/success-icon.svg'
import './style.scss';

interface IToggleSwitch {
  checked?: boolean;
  onChange?: () => void;
}

const ToggleSwitch: React.FC<IToggleSwitch> = (props) => {
  const { checked, onChange } = props;

  return (
    <div className="toggle-button">
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider round">
         <Image src={SuccessIcon} alt="" className="slider-image" />
        </span>
      </label>
    </div>
  )
};

export default ToggleSwitch;
