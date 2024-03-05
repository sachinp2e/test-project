import React from 'react';
import AssetDetails from '@/Containers/AssetsDetails';
import SubNavBar from '@/Components/SubNavBar';
import FooterSection from '@/Components/Footer';

const AssetsPage = () => {
  return (
    <>
      <SubNavBar alwaysSticky />
      <AssetDetails />
      <FooterSection/>
    </>
  );
};

export default AssetsPage;
