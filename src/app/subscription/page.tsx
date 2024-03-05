import React from 'react';
import AuthWrapper from "../../Wrappers/AuthWrapper";
import SubscriptionCards from "../../Containers/subscription/index";

const Page = () => {
  return (
    <AuthWrapper>
      <SubscriptionCards />
    </AuthWrapper>
  );
};

export default Page;
