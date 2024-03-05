import React from 'react';
import Signup from '../../Containers/Auth/Signup/index';
import PublicWrapper from '@/Wrappers/PublicWrapper';

const Page = () => {
  return (
    <PublicWrapper>
      <Signup />
    </PublicWrapper>
  );
};

export default Page;
