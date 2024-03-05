import React from 'react';
import UserDetailPage from '@/Containers/userDetailPage';
import AuthWrapper from '../../../Wrappers/AuthWrapper';

const Page = () => {
  return (
    <AuthWrapper>
      <UserDetailPage />
    </AuthWrapper>
  );
};

export default Page;
