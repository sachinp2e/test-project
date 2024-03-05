import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import Image from 'next/image';
import { Arrow } from '@/Assets/svg';
import './sub-nav-dropdow.scss';

interface ILogoutModalType {}

const menuItems = [
  {
    label: 'My Profile',
    value: 'My Profile',
  },
  {
    label: 'Settings',
    value: 'Settings',
  },
  {
    label: 'Log Out',
    value: 'Log Out',
  },
];

const SubNavDropdown: React.FC<ILogoutModalType> = () => {
  const [open, setOpen] = useState(false);

  const handleArrow = () => {
    setOpen(!open);
  };

  return (
    <div className="sub-nav-container">
      <Dropdown autoClose="inside" show={open} onToggle={handleArrow}>
        <Dropdown.Toggle>
          <Arrow
            stroke={'#FFF'}
            className={`arrow-down ${open ? 'arrow-up' : ''}`}
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item className="p-0">
            <div className="profile-details">
              <div className="avatar">SA</div>
              <div className="user">
                <span className="name">Shivam Arora</span>
                <span className="email">sarora2015@gmail.com</span>
              </div>
            </div>
          </Dropdown.Item>
          <hr className="horizontal-rule" />
          {menuItems.map((item, index) => (
            <Dropdown.Item eventKey={item.label} key={index}>
              <span>
                {/* @ts-ignore */}
                {item?.flag ? (
                  //@ts-ignore
                  <Image src={item?.flag} alt="flag image" />
                ) : null}
              </span>
              <span className="value">{item.value}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default SubNavDropdown;
