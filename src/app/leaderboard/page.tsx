import React from 'react';
import Leaderboard from '../../Containers/Leaderboard';
import SubNavBar from '@/Components/SubNavBar';
import Footer from '@/Components/Footer';
import ScrollToTopButton from '@/Components/scrollToTop';

const Page = () => {
  return (
    <>
      <SubNavBar alwaysSticky />
      <Leaderboard />
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default Page;
