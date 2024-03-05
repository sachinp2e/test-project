import React from 'react';
import ForgetPasswordScreens from '@/Containers/Auth/ForgotPassword';
import PublicWrapper from '@/Wrappers/PublicWrapper';

const Page = () => {
  return (
    <PublicWrapper>
      <ForgetPasswordScreens />
    </PublicWrapper>
  );
};

export default Page;
