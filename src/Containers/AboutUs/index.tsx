'use client';
import React from 'react';
import Image from 'next/image';
import Button from '@/Components/Button';
import sectionOneBg from '@/Assets/_images/about-us-1.jpg';
import sectionTwoImg1 from '@/Assets/_images/about-us-2.jpg';
import sectionTwoImg2 from '@/Assets/_images/about-us-3.jpg';
import sectionThreeBg from '@/Assets/_images/about-us-4.jpg';
import sectionThreeImg1 from '@/Assets/_images/about-us-5.webp';
import sectionThreeImg2 from '@/Assets/_images/about-us-6.webp';
import sectionThreeImg3 from '@/Assets/_images/about-us-7.webp';
import sectionFourImg1 from '@/Assets/_images/about-us-8.jpg';
import sectionFourImg2 from '@/Assets/_images/about-us-9.png';
import ArrowBtnImg from '@/Assets/_images/arrow-circle-right.svg';
import { useRouter } from 'next/navigation';
import './about-us.scss';
import CarouselSection from './CarouselSection';
import { LinkedinIcon, TwitterIcon } from '@/Assets/svg';
import TeamSlider from './TeamSlider';

const AboutUs = () => {
  const router = useRouter();

  return (
    <div className='about-us-body-wrapper'>
      <section className="section-one">
        <Image src={sectionOneBg} alt='cyber-girl-image' height={2000} width={2000} quality={100} />
        <div>
          <h1>Welcome to NiftiQ</h1>
          <span>We believe in a journey towards a transparent marketplace <br />
            connecting creators and enthusiasts globally.
          </span>
        </div>
      </section>
      <section className="section-two">
        <div className='center-box'>
          <div className='content-wrapper'>
            <div className='image-wrapper'>
            <Image src={sectionTwoImg1} alt='vr-girl-image' height={2000} width={2000} quality={100} />
            </div>
            <div className='text-wrapper'>
              <h5>ABOUT US</h5>
              <span>NiftiQ is the premier destination for digital art and artists. We promote access to and ownership of rare, unique,
                and quirky art and digital accessories through programmable Fiat currency. Our trusted digital assets marketplace is
                powered by KALP, an industry leading blockchain technology and supported by a community of creators and enthusiasts
                around the world. 
              </span>
            </div>
          </div>
          <div className='content-wrapper'>
            <div className='text-wrapper'>
              <h5>OUR MISSION</h5>
              <span>Our mission is to democratize the digital assets marketplace, making it accessible to all. We're dedicated to
                fostering inclusivity, sustainability, and collaboration within our marketplace, empowering artists and enthusiasts alike.
              </span>
            </div>
            <div className='image-wrapper'>
              <Image src={sectionTwoImg2} alt='6g-jumping-image' height={2000} width={2000} quality={100} />
            </div>
          </div>
        </div>
      </section>
      <section className='section-three'>
        <div className='background-img-wrapper'>
          <Image src={sectionThreeBg} alt='globe-image' quality={100} height={2000} width={2000}/>
        </div>
        <div className='center-box display-lg-screen'>
          <div className='text-wrapper'>
            <h2>WHY NIFTIQ</h2>
            <span>We believe in making your journey smoother and hassle-free, giving more freedom to creators and limitless options for
              explorers.
            </span>
          </div>
          <div className='cards-wrapper'>
            <div className='card-wrapper'>
              <h5>Game Changer</h5>
              <Image src={sectionThreeImg1} alt='doll-image' quality={100} height={1000} width={1000}/>
              <span>The provenance of each digital asset is always available for creators to monetize their work and collectors to buy
                with confidence.
              </span>
            </div>
            <div className='card-wrapper'>
              <h5>Natively Digital</h5>
              <Image src={sectionThreeImg2} alt='doll-image' quality={100} height={1000} width={1000}/>
              <span>Powered by Kalp blockchain, NiftiQ showcases unique assets in wide digital media, ensuring authenticity and
                scarcity.
              </span>
            </div>
            <div className='card-wrapper'>
              <h5>Ultimate Protection</h5>
              <Image src={sectionThreeImg3} alt='doll-image' quality={100} height={1000} width={1000}/>
              <span>Every transaction of digital assets is backed by a legal layer ensuring full protection for buyers and
                sellers.
              </span>
            </div>
          </div>
          <Button
              className="explore-assets-btn"
              element={(
                <div className="d-flex align-items-center">
                  <span className="me-2">Explore Assets</span>
                  <Image src={ArrowBtnImg} alt="arrow" />
                </div>
              )}
              onClick={() => router.push('/explore/assets')}
              isFilled
              isGradient
            />
        </div>
        <CarouselSection/>
      </section>
      <section className='section-four'>
        <div className='center-box'>
          <h4>MEET OUR TEAM OF EXPERTS BRINGING IDEAS TO LIFE</h4>
          <div className='founder-section-wrapper'>
            <div className='bg-absolute-text'>CORE MEMBERS</div>
            <div className='vertical-text-wrapper'>
              <div className='absolute-wrapper'>
                <div><span>VISIONARY</span></div>
                <span>LEADERS</span>
              </div>
            </div>
            <div className='founder-cards-wrapper'>
              <div className='founder-card-wrapper'>
                <Image src={sectionFourImg1} alt='globe-image' quality={100} height={2000} width={2000} />
                <div className='founder-info-wrapper'>
                  <p>Tapan Sangal</p>
                  <p>Founder & Chief Evangelist</p>
                </div>
                <div className='social-icons-wrapper'>
                  <TwitterIcon width={34} height={34}/>
                  <LinkedinIcon />
                </div>
              </div>
              <div className='founder-card-wrapper'>
                <Image src={sectionFourImg2} alt='globe-image' quality={100} height={2000} width={2000} />
                <div className='founder-info-wrapper'>
                  <p>Gagan Singhal</p>
                  <p>Co-Founder</p>
                </div>
                <div className='social-icons-wrapper'>
                  <TwitterIcon width={34} height={34}/>
                  <LinkedinIcon />
                </div>
              </div>
            </div>
          </div>
          <div className='team-slider-wrapper'>
            <TeamSlider/>
          </div> 
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
