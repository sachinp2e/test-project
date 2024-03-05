import Settings from '@/Containers/settings';
import React, { useEffect } from 'react';
import AuthWrapper from '@/Wrappers/AuthWrapper';

const Page = () => {
  return (
    <AuthWrapper>
      <Settings />
    </AuthWrapper>
  );
};

export default Page;
