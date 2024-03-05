'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';
import {
  Dropdown,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import Tabs from './Tabs';
import CustomModal from '@/Components/CustomModal';
import UserDetailsDropdown from './UserDetails';
import NotificationModal from '@/Components/NotificationModal';
import {
  Arrow,
  Logo,
  MoonIcon,
  SearchIcon,
  SunIcon,
  WalletIcon,
} from '@/Assets/svg';
import ArrowImg from '@/Assets/_images/arrow-circle-right.svg';
import ImgIcon1 from '@/Assets/_images/user-ellipse.png';
import ImgIcon2 from '@/Assets/_images/user-ellipse-1.png';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import './sub-navbar.scss';
import VerifyKycModal from '../VerifyKycModal/page';
import useEffectOnce from '../../Hooks/useEffectOnce';
import { getProfileAction } from '@/Lib/auth/auth.action';
import KycAlert from './KycAlert';
import Button from '@/Components/Button';
import { logout, updateKycReminder } from '@/Lib/auth/auth.slice';
import { getWalletDetails } from '@/Lib/wallet/wallet.action';
import { walletSelector } from '@/Lib/wallet/wallet.selector';
import { getNotifications } from '@/Lib/notifications/notifications.action';
import UseNotificationSocket from '@/Hooks/useNotificationSocket';
import { updateNotificationsState } from '@/Lib/notifications/notifications.slice';
import Link from 'next/link';
import { getAllCurrencies } from '@/Lib/currencies/currencies.action';

// TODO: Remove this variable and use state instead
let initialModalStatus = true;

type MenuItemsType = {
  label: string;
  value: 'assets' | 'catalogs' | 'users';
};

const menuItems: MenuItemsType[] = [
  {
    label: 'Assets',
    value: 'assets',
  },
  {
    label: 'Catalogs',
    value: 'catalogs',
  },
  {
    label: 'Users',
    value: 'users',
  },
];

interface ISubNavBarType {
  alwaysSticky?: boolean;
}

const SubNavBar: React.FC<ISubNavBarType> = ({ alwaysSticky = false }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params:any = useParams();
  const dispatch = useAppDispatch();

  const searchValue = searchParams.get('search') || '';

  const { walletBalance } = useAppSelector(walletSelector);
  const { accessToken, userDetails, isLoggedIn, kycReminder, userId } =
    useAppSelector(authSelector);

  const [isSticky, setIsSticky] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(initialModalStatus);
  const [open, setOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [showKycModal, toggleKycModal] = useState<boolean>(false);
  // @ts-ignore
  const [dropdownValue, setDropdownValue] = useState<any>(
    menuItems.map((i) => i.value).includes(params?.type)
      ? params?.type
      : 'assets',
  );

  const newSocketNotificationHandler = (data: any) => {
    dispatch(updateNotificationsState(data));
  };

  const socket = UseNotificationSocket(newSocketNotificationHandler);

  // set the search value in params to explore page on debounce of 500ms
  const debounced = debounce((value: string) => {
    router.push(`/explore/${dropdownValue}?search=${value}`, {
      shallow: true,
    });
  }, 2000);

  const handleInputChange = (e: any) => {
    debounced(e.target.value);
  };

  const handleToggleChange = () => {
    setToggle(!toggle);
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

  const setSelectedDropdownValue = (value: 'assets' | 'catalogs' | 'users') => {
    // dispatch(setGlobalSearchType(value));
    setDropdownValue(value);
  };

  const handleScroll = () => {
    if (window.pageYOffset > 60) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }

  };
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      dispatch(logout());
    }
  }, []);
  useEffect(() => {
    if (alwaysSticky) {
      return;
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleArrow = () => {
    setOpen(!open);
  };

  const img = [ImgIcon2, ImgIcon1];

  const assetsData = [
    {
      id: '1',
      logo: <Image src={ImgIcon1} alt="ellipse" />,
      title: 'Single',
      subtitle: 'If you want your Asset to be one of a kind',
      href: 'create-asset/single',
    },
    {
      id: '2',
      logo: (
        <div className={'avatar-wrapper'}>
          {img.map((i, index) => (
            <div className="avatar-sub" key={index}>
              <Image src={i} alt="avatar" />
            </div>
          ))}
        </div>
      ),
      title: 'Multiple',
      subtitle: 'If you want your Asset to be one of a kind',
      href: 'create-asset/multiple',
    },
  ];

  const fetchData = async () => {
    try {
      let newData; 
      if (accessToken) {
        dispatch(getNotifications());
        const res: any = await dispatch(getProfileAction());
        newData = res.payload.result;
      }

      if(userDetails?.isKycVerified || newData?.isKycVerified){
        dispatch(getWalletDetails());
      }
      dispatch(getAllCurrencies());
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffectOnce(() => {
    fetchData();
  });

  const navigateToCreateAsset = () => {
    router.push('/create-asset/single');
  };

  const navigateToPage = (data?: any) => () => {
    router.push(`/${data?.href || ''}`);
  };

  const tooltip = (
    <Tooltip id="tooltip" className="create-asset-tooltip">
      {assetsData.map((data, index) => (
        <div key={index}>
          <div className="tooltip-elem" onClick={navigateToPage(data)}>
            <div className="create-asset">
              <div className="img-container">{data.logo}</div>
              <div className="text">
                {data.title}
                <span className="inner-text">{data.subtitle}</span>
              </div>
            </div>
          </div>
          {assetsData.length - 1 !== index && <hr />}
        </div>
      ))}
    </Tooltip>
  );

  return (
    <>
      <div>
        <div
          className={`sub-navbar ${isSticky || alwaysSticky ? 'sticky' : ''}`}
        >
          <div className="nav-item container-fluid">
            <div className="navbar-inner-container">
              {(isSticky || alwaysSticky) && (
                <Link href={'/'} className="nav-logo" >
                  <Logo />
                </Link>
              )}
              <div className="right-wrapper">
                <div className="search-bar">
                  <SearchIcon className="position-absolute ms-2 z-1" />
                  <InputGroup size="lg">
                    <Form.Control
                      placeholder="Search by Assets, catalogs, users..."
                      className="search-input"
                      defaultValue={searchValue}
                      onChange={handleInputChange}
                    />
                    <Dropdown show={open} onToggle={handleArrow}>
                      <Dropdown.Toggle className="input-dropdown">
                        <span>{dropdownValue}</span>
                        <Arrow
                          className={`arrow-down ${open ? 'arrow-up' : ''}`}
                        />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {menuItems.map((item, index) => (
                          <Dropdown.Item
                            eventKey={item.label}
                            key={index}
                            onClick={() => setSelectedDropdownValue(item.value)}
                          >
                            <span className="value">{item.label}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </InputGroup>
                </div>
              </div>
              <div className="left-wrapper">
                <Tabs isSticky={isSticky || alwaysSticky} />
                {(isSticky || alwaysSticky) && (
                  <>
                    {accessToken && (
                      <Link
                        href={`/settings/myWallet/${userId}`}
                        className="wallet-wrapper"
                      >
                        <div className="tooltip-container">
                          <WalletIcon />
                          <span className="tooltip-text">
                            Balance:${walletBalance?.toFixed(3)}
                          </span>
                        </div>
                      </Link>
                    )}
                    {/*
                    <div
                      className="subnav-nightmode"
                      onClick={handleToggleChange}
                    >
                      {!toggle ? (
                        <MoonIcon className={'position-relative'} />
                      ) : (
                        <SunIcon />
                      )}
                    </div> */}
                    {accessToken && (
                      <div>
                        <NotificationModal />
                      </div>
                    )}
                  </>
                )}
                <div className="btn-wrapper">
                  {userDetails?.isKycVerified ? (
                    // <OverlayTrigger
                    //   placement="bottom-start"
                    //   overlay={tooltip}
                    //   trigger="click"
                    //   rootClose
                    // >
                    //
                    // </OverlayTrigger>
                    // TODO: Remove the below button and use the above overlay trigger
                    <button
                      onClick={navigateToCreateAsset}
                      className={`create-asset ${
                        isSticky || alwaysSticky ? 'text-white' : 'text-black'
                      }`}
                    >
                      Create Asset
                    </button>
                  ) : (
                    <Button
                      isFilled
                      isGradient
                      onlyVerifiedAccess
                      text="Create Asset"
                      className={`create-asset ${
                        isSticky || alwaysSticky ? 'text-white' : 'text-black'
                      }`}
                    />
                  )}
                </div>
                <div className="avatar-wrapper">
                  <div className="rounded-circle avatar">
                    {accessToken ? (
                      <div className="avatar-modal">
                        <UserDetailsDropdown
                          isSticky={isSticky || alwaysSticky}
                        />
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
              </div>
            </div>
          </div>
        </div>
        {userDetails?.id && !userDetails?.isKycVerified && (
          <KycAlert
            kycStatus={userDetails?.kycStatus || 'PENDING'}
            toggleKycModal={toggleKycModal}
          />
        )}
      </div>

      {kycReminder && (
        <CustomModal show={openModal} onHide={handleModalCloseEvent}>
          <div className="modal-children">
            <div className="heading">Please get KYC verified first</div>
            <div className="sub-heading">
              KYC is necessary to access all features of the platform.
            </div>
            <Button
              className="kyc-btn"
              element={
                <span>
                  Let's get started <Image src={ArrowImg} alt="" />
                </span>
              }
              isFilled
              isGradient
              onClick={handleConfirm}
            />
            <div className="skip" onClick={handleModalCloseEvent}>
              Skip
            </div>
          </div>
        </CustomModal>
      )}
      {showKycModal && (
        <VerifyKycModal
          showKycModal={showKycModal}
          toggleKycModal={toggleKycModal}
        />
      )}
    </>
  );
};

export default SubNavBar;
