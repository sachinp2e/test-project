import React from 'react';
import Leaderboard from '../../Containers/Leaderboard';
import AuthWrapper from '../../Wrappers/AuthWrapper';

const Page = () => {
  return (
    <AuthWrapper>
      <Leaderboard />;
    </AuthWrapper>
  );
};

export default Page;
