import React from 'react';
import UserDetailPage from '@/Containers/userDetailPage';
import AuthWrapper from '../../../Wrappers/AuthWrapper';
import SubNavBar from '@/Components/SubNavBar';
import FooterSection from '@/Components/Footer';

const Page = () => {
  return (
    <>
      <SubNavBar alwaysSticky />
      <UserDetailPage />
      <FooterSection />
    </>
  );
};

export default Page;
