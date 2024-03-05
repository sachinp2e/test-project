// Component to have three steps for creating an asset with dotted lines, completed steps and active step

import React from 'react';
import {
  getBorderStyle,
  getBorderStyleOne,
} from '@/Containers/createAssets/utils';
import { GreenCheckedIcon } from '@/Assets/svg';

interface IStepperProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  steps: string[];
}

const Stepper: React.FC<IStepperProps> = ({
  activeStep,
  setActiveStep,
  steps,
}) => {
  return (
    <div className="stepper">
      <ul>
        {steps.map((step, index) => (
          <li key={index} className={`${activeStep > index + 1 ? 'checked' : ''}`}>
            <span
              // onClick={() => handleStepClick(index + 1)}
              className={`stepper-line ${activeStep === index + 1 ? 'active' : ''} ${
                activeStep > index + 1 ? 'completed' : '' 
              }`}
            >
              {activeStep > index + 1 ? (
                <GreenCheckedIcon fill="#000" height="50" width="50" />
              ) : (
                `0${step}`
              )}
            </span>
          </li>
        ))}
        <div
          className="horizontal-line-one"
          style={getBorderStyle(activeStep)}
        />
        <div
          className="horizontal-line-two"
          style={getBorderStyleOne(activeStep)}
        />
      </ul>
    </div>
  );
};

export default Stepper;
