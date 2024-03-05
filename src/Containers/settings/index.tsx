'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import MyKyc from './MyKyc/index';
import EditProfile from './EditProfile';
import NotificationSettings from './Notifications';
import TwoFactorAuthentication from '@/Containers/settings/TwoFactorAuthentication';
import MyWallet from '@/Containers/settings/MyWallet';
import { useAppSelector } from '@/Lib/hooks';
import settingsCover from '@/Assets/_images/settings-cover.jpg';
import './style.scss';
import { authSelector } from '@/Lib/auth/auth.selector';

enum SettingPage {
  editProfile = 'Edit Profile',
  notifications = 'Notifications',
  // twoFactorAuthentication = '2 Factor Authentication',
  myWallet = 'My Wallet $',
  myKyc = 'My KYC',
}

interface ISearchPageType {}

const Settings: React.FC<ISearchPageType> = () => {
  const params = useParams();
  const router = useRouter();

  const { userDetails } = useAppSelector(authSelector);

  const onPageChange = (page: SettingPage) => () => {
    router.push(`/settings/${page}/${params.userId}`);
  };

  const renderSelectedSettingPage = () => {
    // @ts-ignore
    switch (SettingPage[params.type]) {
      case SettingPage.editProfile:
        return <EditProfile />;
      case SettingPage.notifications:
        return <NotificationSettings />;
      // case SettingPage.twoFactorAuthentication:
        // return <TwoFactorAuthentication />;
      case SettingPage.myWallet:
        return <MyWallet />;
      case SettingPage.myKyc:
        return <MyKyc />;
      default:
        return <div>Edit Profile</div>;
    }
  };

  return (
    <div className="settings-page">
      <div className="cover-image">
        <Image
          src={settingsCover}
          alt="banner image"
          quality={100}
          width={2000}
          height={2000}
          className="settings-cover"
        />
        <p className="settings-para">Settings</p>
      </div>
      <div className="body-section">
        <div className="body-section-left">
          <div className="body-section-left-content">
            {Object.entries(SettingPage).map(([key, value]) => (
              <div
                key={key}
                className={`body-section-left-content__item ${
                  params.type === key ? 'active' : ''
                }`}
                onClick={onPageChange(key as SettingPage)}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
        <div className="body-section-right">{renderSelectedSettingPage()}</div>
      </div>
    </div>
  );
};

export default Settings;
