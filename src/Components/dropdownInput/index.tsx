// components/DropdownInput.tsx
import React, { useState } from 'react';
import './dropdown-input.scss';

interface DropdownProps {
  options: string[];
}

const DropdownInput: React.FC<DropdownProps> = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(event.target.value);
    setSelectedOption(null); // Reset selected option when user types in the input
  };

  return (
    <div className="dropdown-custom">
      <input
        type="text"
        placeholder="Select an option or enter a custom value"
        value={selectedOption ? selectedOption : customValue}
        onChange={handleInputChange}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />
      {isDropdownOpen && (
        <div className="optionsContainer">
          {options.map((option) => (
            <div key={option} onClick={() => handleOptionClick(option)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownInput;
