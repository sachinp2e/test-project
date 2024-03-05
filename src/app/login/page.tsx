import React from 'react';
import Login from '../../Containers/Auth/LoginScreen';
import PublicWrapper from '@/Wrappers/PublicWrapper';

const Page = () => {
  return (
    <PublicWrapper>
      <Login />
    </PublicWrapper>
  );
};

export default Page;
