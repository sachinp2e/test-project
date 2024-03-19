'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import SettingIcon from '../../Assets/_images/three-dot-setting-icon.svg';
import './toggle-tab.scss';
import { Dropdown } from 'react-bootstrap';

interface IToggleTabType {
  tabs: string[];
  activeToggle: string;
  children?: JSX.Element[];
  handleTabClick?: (tab: string) => void;
}

const ToggleTab: React.FC<IToggleTabType> = (props) => {
  const { tabs, children, handleTabClick, activeToggle } = props;
  const [activeTab, setActiveTab] = useState<string>(activeToggle);

  return (
    tabs.length > 0 && (
      <div className="toggle-tab">
        <div className="tabs">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`tab ${tab === activeToggle ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                handleTabClick?.(tab);
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default ToggleTab;
