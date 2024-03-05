import React from 'react'
import TrendingSection from './TrendingSection/index'
import HeroSection from './HeroSection/index'
import VideoSection from './VideoSection/index'
import TopCatalogs from './TopCatalogs/index'
import TrustedPartners from './TrustedPartners/index'
import Testimonials from './TestimonialSection/index'
import NavBar from './Navbar/index';
import SubNavBar from '../../Components/SubNavBar/index';
import FooterSection from '@/Components/Footer';
import ScrollToTopButton from '../../Components/scrollToTop/index';
import TrendingFrame from "./TrendingSection/TrendingFrame";
import './landing.scss'

const Landing = () => {
  return (
    <div className="landing-page">
      <NavBar />
      <SubNavBar />
      <HeroSection />
      <TrendingSection />
      <TopCatalogs
        toggleTab
        title="top Catalogs"
        desc="Check out the video to make your journey even more easier."
      />
      <VideoSection />
      <TrendingFrame />
      <TrustedPartners />
      <Testimonials />
      <FooterSection />
      {/* <ScrollToTopButton /> */}
    </div>
  );
};

export default Landing;
