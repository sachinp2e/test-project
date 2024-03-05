import CreateAssets from '@/Containers/createAssets';
import React from 'react';
import AuthWrapper from '@/Wrappers/AuthWrapper';

const Page = () => {
  return (
    <AuthWrapper>
      <CreateAssets />
    </AuthWrapper>
  );
};

export default Page;
