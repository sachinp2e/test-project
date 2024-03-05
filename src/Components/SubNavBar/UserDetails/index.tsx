import React, { useState } from 'react';
import Image from 'next/image';
import { Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { logout } from '@/Lib/auth/auth.slice';
import { authSelector } from '@/Lib/auth/auth.selector';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import Avatar from '@/Assets/_images/avatar.svg';
import { Arrow, LogoutIcon, MyProfileIcon, SettingIcon } from '@/Assets/svg';
import './user-details-dropdow.scss';

interface IUserDetailsDropdownType {
  isSticky?: boolean;
}

interface IMenuItem {
  id: number;
  label: string;
  value: string;
  icon: JSX.Element;
}

const menuItems: IMenuItem[] = [
  {
    id: 1,
    label: 'My Profile',
    value: 'My Profile',
    icon: <MyProfileIcon />,
  },
  {
    id: 2,
    label: 'Settings',
    value: 'Settings',
    icon: <SettingIcon />,
  },
  {
    id: 3,
    label: 'Log Out',
    value: 'Log Out',
    icon: <LogoutIcon />,
  },
];

export const getUserIdFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return '';
};

const UserDetailsDropdown: React.FC<IUserDetailsDropdownType> = (props) => {
  const { isSticky } = props;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { userId, userDetails } = useAppSelector(authSelector);

  const handleArrow = () => {
    setOpen(!open);
  };

  const handleClick = async (id: number) => {
    if (id === 1) {
      router.push(`/user/${userDetails?.id}?tab=Assets`);
    }else if (id === 2) {
      router.push(`/settings/editProfile/${userId}`);
    }
    if (id === 3) {
      dispatch(logout());
      router.push('/login');
    }
  };

  return (
    
    <div className="sub-nav-container">
      <Dropdown show={open} onToggle={handleArrow}>
        <Dropdown.Toggle>
          <div className='d-flex align-items-center gap-2'>
            {userDetails?.profileImage ? (
              <div className="img-wrapper">
                <Image src={userDetails?.profileImage} alt="avatar" onClick={handleArrow} quality={100} width={100} height={100}/>
              </div>
            ) : (
              <div className="profile-navbar-avatar">
                {userDetails?.firstName && userDetails?.firstName[0]}
                {userDetails?.lastName && userDetails?.lastName[0]}
              </div>
            )}
            <Arrow
              stroke={`${isSticky ? '#FFF' : '#000'}`}
              className={`arrow-down ${open ? 'arrow-up' : ''}`}
            />
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item className="p-0">
            <div className="profile-details">
              <div className="avatar">
                {userDetails?.firstName && userDetails?.firstName[0]}
                {userDetails?.lastName && userDetails?.lastName[0]}
              </div>
              <div className="user">
                <span className="name">
                  {userDetails?.firstName} {userDetails?.lastName}
                </span>
                <span className="email">{userDetails?.email}</span>
              </div>
            </div>
          </Dropdown.Item>
          <hr />
          {menuItems.map((item) => (
            <Dropdown.Item
              eventKey={item.label}
              key={item.id}
              onClick={() => handleClick(item.id)}
            >
              <div className="icon">{item.icon}</div>
              <span className="value">{item.value}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserDetailsDropdown;
