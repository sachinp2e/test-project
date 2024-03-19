"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserDetailsDropdown from '@/Components/SubNavBar/UserDetails';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import { getProfileAction } from '@/Lib/auth/auth.action';
import Button from '@/Components/Button';
import { logout, updateKycReminder } from '@/Lib/auth/auth.slice';
import { walletSelector } from '@/Lib/wallet/wallet.selector';
import Link from 'next/link';
import {
  HamburgerIcon,
  NavLogo
} from '@/Assets/svg';
import "./mobileNavbar.scss";

let initialModalStatus = true;

const MobileNavbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { walletBalance } = useAppSelector(walletSelector);
  const { accessToken, userDetails, isLoggedIn, kycReminder, userId } = useAppSelector(authSelector);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [openModal, setOpenModal] = useState<boolean>(initialModalStatus);
  const [open, setOpen] = useState(false);
  const [showKycModal, toggleKycModal] = useState<boolean>(false);
  const [dropdownValue, setDropdownValue] = useState<'assets' | 'catalogs' | 'users'>('assets');
  const [searchValue, setSearchValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleModalCloseEvent = () => {
    setOpenModal((prev) => !prev);
    dispatch(updateKycReminder());
  };

  const handleConfirm = () => {
    setOpenModal((prev) => !prev);
    dispatch(updateKycReminder());
    toggleKycModal((prev) => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      dispatch(logout());
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      dispatch(getProfileAction());
    }
  }, []);

  const navigateToCreateAsset = () => {
    router.push('/create-asset/single');
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(prev=>!prev);
  };
  const scrollToVideoSection = () => {
    const videoSectionElement = document.querySelector('.main-video-section-wrapper');
    if (videoSectionElement) {
      videoSectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <>
      <div className="mobile-navbar">
        <div className="nav-item container-fluid">
          <div className="mobile-navbar-inner-container">
            <div className="nav-logo" onClick={() => router.push('/')}>
              <NavLogo />
            </div>
            <div className="left-wrapper">
            <div className="btn-wrapper">
                  {userDetails?.isKycVerified ? (
                    <button
                      onClick={navigateToCreateAsset}
                      className='create-asset display-none'
                    >
                      Create Asset
                    </button>
                  ) : (
                    <Button
                      isFilled
                      isGradient
                      onlyVerifiedAccess
                      text="Create Asset"
                      className='create-asset display-none'
                    />
                  )}
                </div>
              <div className="avatar-wrapper">
                <div className="rounded-circle avatar">
                  {accessToken ? (
                    <div className="avatar-modal">
                      <UserDetailsDropdown />
                    </div>
                  ) : (
                    <Button
                      className="login-subnav-btn"
                      element={
                        <div className="d-flex align-items-center">
                          <span className="me-2">Login</span> 
                        </div>
                      }
                      onClick={() => router.push('/login')}
                      isFilled
                      isGradient
                    />
                  )}
                </div>
              </div>
              <div className="hambuger" onClick={handleToggleMenu}>
                <HamburgerIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
              <div className={`mobile-menu ${isMenuOpen ? 'menu-open':'menu-close'}`}>
                  {/* <div className="mobile-menu-heading">
                      <p>Menu</p>
                      <span onClick={handleToggleMenu}>
                          <CrossCircleIcon />
                      </span>
                  </div> */}
            <div className='mobile-menu-body'>
                <span className ="menu-leaderboard-cursor"onClick={scrollToVideoSection}>How it Works</span>
                <span className ="menu-leaderboard-cursor mobile-view"onClick={navigateToCreateAsset}>Create Asset</span>
                <span onClick={() => router.push('/leaderboard')} className="menu-leaderboard-cursor">Leaderboard</span>
                <span onClick={() => router.push('/subscription')} className="menu-leaderboard-cursor">Apps</span>
                <span className='menu-leaderboard-cursor menu-wallet'> {accessToken && (
                      <Link
                        href={`/settings/myWallet/${userId}`}
                        className="wallet-wrapper"
                      >
                        Wallet
                    </Link>
                )}
                </span>
            </div>
            
        </div>
    </>
  );
};

export default MobileNavbar;
