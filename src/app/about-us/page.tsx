import React from 'react';
import SubNavBar from '@/Components/SubNavBar';
import Footer from '@/Components/Footer';
import AboutUs from '@/Containers/AboutUs';

const page = () => {
  return (
    <>
      <SubNavBar alwaysSticky />
      <AboutUs />
      <Footer />
    </>
  );
};

export default page;