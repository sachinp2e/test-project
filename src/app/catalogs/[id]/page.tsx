import React from 'react';
import Catalogs from '@/Containers/catalogs';
import SubNavBar from '@/Components/SubNavBar';
import Footer from '@/Components/Footer';
import ScrollToTopButton from '@/Components/scrollToTop';

const page = () => {
  return (
    <>
      <SubNavBar alwaysSticky />
      <Catalogs />
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default page;
