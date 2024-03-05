import React from 'react';
import Explore from '@/Containers/explore';
import SubNavBar from '@/Components/SubNavBar';
import Footer from '@/Components/Footer';
import ScrollToTopButton from '@/Components/scrollToTop';

const Page = () => {
  return (
    <>
      <SubNavBar alwaysSticky />
      <Explore />
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default Page;
