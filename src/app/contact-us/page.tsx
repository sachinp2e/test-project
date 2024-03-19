import React from 'react';
import SubNavBar from '@/Components/SubNavBar';
import Footer from '@/Components/Footer';
import ContactUs from '@/Containers/ContactUs';

const page = () => {
  return (
    <>
      <SubNavBar alwaysSticky />
      <ContactUs />
      <Footer />
    </>
  );
};

export default page;