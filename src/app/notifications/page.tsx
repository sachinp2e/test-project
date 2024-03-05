import React from 'react';
import NotificationsDetail from '@/Containers/notification';
import AuthWrapper from "../../Wrappers/AuthWrapper";

const Page = () => {
  return (
    <AuthWrapper>
      <NotificationsDetail />
    </AuthWrapper>
  )
};

export default Page;
