import React from 'react';
import ResetPassword from '@/Containers/Auth/ResetPassword';
import PublicWrapper from '@/Wrappers/PublicWrapper';

const Page = () => {
  return (
    <PublicWrapper>
      <ResetPassword />
    </PublicWrapper>
  );
};

export default Page;
