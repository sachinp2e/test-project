'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NotificationModal from '../../../Components/NotificationModal';
import CustomSelect from '../../../Components/CustomSelect';
import { NavLogo, WalletIcon, SunIcon, MoonIcon } from '@/Assets/svg';
import './navbar.scss';
import { useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import { walletSelector } from '@/Lib/wallet/wallet.selector';
import Link from 'next/link';

interface INavBarType {}

const menuItems = [
  {
    label: 'USD',
    value: 'USD',
  },
  {
    label: 'INR',
    value: 'INR',
  },

  {
    label: 'ETH',
    value: 'ETH',
  },
  {
    label: 'AED',
    value: 'AED',
  },
  {
    label: 'Rial',
    value: 'Rial',
  },
];

const NavBar: React.FC<INavBarType> = () => {
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState('');

  const { accessToken,userId } = useAppSelector(authSelector);
  const userLoggedIn: boolean = accessToken ? true : false;

  const { walletBalance } = useAppSelector(walletSelector);

  const handleToggleChange = () => {
    setToggle(!toggle);
  };

  const handleSelectChange = (name: string, option: any) => {
    setSelectedOptions(option.value);
  };


  return (
    <>
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-wrapper">
            <Link href={'/'} className="right-wrapper">
              <NavLogo />
            </Link>
            <div className="left-wrapper">
              {/* <div className="dropdown-wrapper">
                <CustomSelect
                  name="currency"
                  placeholder="USD"
                  value={selectedOptions}
                  options={menuItems}
                  onChange={handleSelectChange}
                  className="nav-select"
                />
              </div> */}
              {userLoggedIn && (
                 <Link
                 href={`/settings/myWallet/${userId}`} className="wallet-wrapper">
                  <div className="tooltip-container">
                    <WalletIcon />
                    <span className="tooltip-text">Balance:${walletBalance}</span>
                  </div>
                </Link>
              )}
              {/* <div
                className={toggle ? 'toggle-wrapper active' : 'toggle-wrapper'}
              >
                <div
                  className={toggle ? 'toggle-btn active' : 'toggle-btn'}
                  onClick={handleToggleChange}
                >
                  {!toggle ? (
                    //@ts-ignore
                    <MoonIcon className={'position-relative'} />
                  ) : (
                    <SunIcon />
                  )}
                </div>
              </div> */}
              {userLoggedIn && (
                <div className="notification">
                  <NotificationModal />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
