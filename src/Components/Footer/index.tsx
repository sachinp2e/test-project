'use client'
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/Components/Button';
import {  NavLogo, Twitter } from '@/Assets/svg';
import ArrowCircleRightImg from '@/Assets/_images/arrow-circle-right.svg';
import InstagramImg from '@/Assets/_images/instagram-img.png';
import DiscordImg from '@/Assets/_images/discord-img.svg';
import EnglishUKImg from '@/Assets/_images/english-flag.png';
import ArabicARABImg from '@/Assets/_images/arabic-flag.png';
import { IOption } from '../CustomSelect';
import SpanishSPAINImg from '@/Assets/_images/spanish-flag.png';
import CustomSelect from '../CustomSelect';
import { authSelector } from '@/Lib/auth/auth.selector';
import { useAppSelector } from '@/Lib/hooks';
import { useRouter } from 'next/navigation';
import MobileFooterSection from './MobileFooterSection';
import { getAllCategorySelector } from '@/Lib/category/category.selector';
import './footer.scss';
import { debounce } from 'lodash';
import { toastErrorMessage, toastSuccessMessage } from '@/utils/constants';
import  KalpStudioLogo  from '@/Assets/_images/kalpStudiLogo.png';

const menuItems = [
  {
    label: <span className="flag-icon"><Image src={EnglishUKImg}  alt='' />English</span>,
    value: 'English',
  },
  // {
  //   label: <span className="flag-icon"><Image src={ArabicARABImg}  alt='' />Arabic</span>,
  //   value: 'Arabic',
  // },
  // {
  //   label: <span className="flag-icon"><Image src={SpanishSPAINImg} alt='' />Spanish</span>,
  //   value: 'Spanish',
  // },
];

const FooterSection = () => {
  const [selectedOptions, setSelectedOptions] = useState<string>('')
  const { categories } = useAppSelector(getAllCategorySelector);
  const [isMobile, setIsMobile] = useState(false);
  const handleSelectChange = (name: string, option: IOption) => {
      setSelectedOptions(option.value);
  };
  const { userId, userDetails } = useAppSelector(authSelector);
  const router = useRouter();
  
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [email, setEmail] = useState('');
  
  const validateEmail = (email: string) => {
    const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/; 
    return regex.test(email);
  };
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 440);
    };
  
    window.addEventListener('resize', handleResize);
    handleResize(); 
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const debouncedSubscribe = debounce((email: string) => {
    setIsSubscribing(true);
    setIsSubscribing(false);
  }, 1000);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setIsValidEmail(validateEmail(emailValue)); 
  };



  const handleSubscribe = async () => {
    if (email.length < 1) { 
      toastErrorMessage('Please enter an email first!')
      return; 
    }
    if (isValidEmail) {
      try {
        setIsSubscribing(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/subscribe/newsletter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_id: email,
            is_subscribed: true,
          }),
        });
        
        if (response.ok) {
          toastSuccessMessage(
            'Congratulations! You have subscribed to the newsletter',
          );
        } else {
          toastErrorMessage('You have already subscribed to our service')
        }
      } catch (error) {
        toastErrorMessage('Something went wrong')
      } finally {
        setIsSubscribing(false);
      }
    }
  };

  

  return (
    <>
    {isMobile ? (
        <MobileFooterSection />
      ):(
    <div className="footer-main-wrapper">
      <div className="sub-footer-main-wrapper">
        <div className="section-footer">
          <div className="title-footer">
            <span>Marketplace</span>
          </div> 
          <div className="options-footer">
          <ul>
            {categories.map((category: any) => (
              <li key={category.id}>
                <span className='categories'
                  onClick={() => { router.push(`/explore/assets?category=${category?.name}&id=${category?.id}`); }}>
                  {category.name}
                </span>
              </li>
            ))}
          </ul>
          </div>
        </div>
        <div className="section-footer">
          <div className="title-footer">
            <span>My Account</span>
          </div>
          <div className="options-footer">
            <ul>
              <li>
                <span className='categories' onClick={() => { router.push(`/user/${userDetails?.id}`); }}>Profile</span>
              </li>
              <li>
                <span className='categories' onClick={() => { router.push(`/user/${userDetails?.id}?tab=Favorites&subTab=Assets`); }}>Favorites</span>
              </li>
              <li>
                <span className='categories' onClick={() => { router.push(`/settings/myWallet/${userId}`); }}>Wallet</span>
              </li>
              <li>
                <span className='categories' onClick={() => { router.push(`/user/${userDetails?.id}?tab=Catalogs`); }}>My Catalogs</span>
              </li>
              <li>
                <span className='categories' onClick={() => { router.push(`/settings/editProfile/${userId}`); }}>Settings</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="section-footer company-col">
          <div>
            <div className="title-footer">
              <span>Company</span>
            </div>
            <div className="options-footer">
              <ul>
                <li>
                  <Link href="/about-us">About Us</Link>
                </li>
                <li>
                  <Link href="/contact-us">Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="title-footer">
              <span>Select Language</span>
            </div>
            <div className="options-footer">
              <CustomSelect
                name="currency"
                placeholder={menuItems[0]?.label as JSX.Element}
                value={selectedOptions}
                options={menuItems}
                onChange={handleSelectChange}
                className="footer-select"
              />
            </div>
          </div>
        </div>
        <div className="section-footer">
          <div className="title-footer">
            <span>Join Our Community</span>
          </div>
          <div className="options-footer">
            <ul>
              <li>
                  <span className="social-icon">
                    <Twitter className="hover-item" />
                  </span>
                <Link href="https://twitter.com/Mai_Lab_tech" target='_blank'>Twitter</Link>
              </li>
              <li>
                  <span className="social-icon">
                    <Image src={InstagramImg} alt="" />
                  </span>
                <Link href="https://www.instagram.com/the.mailabs/" target='_blank'>Instagram</Link>
              </li>
              <li>
                  <span className="social-icon">
                    <Image src={DiscordImg} alt="" />
                  </span>
                <Link href="https://discord.com/channels/@me/1202162860088905748" target='_blank'>Discord</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="section-footer">
          <div className="title-footer">
            <span>Subscribe to our Newsletter</span>
          </div>
          <div className="options-footer">
            <ul>
              <li>
                <input type="text" placeholder="Enter your email address..." value={email} onChange={handleEmailChange} />
              </li>
              <li>
                <Button
                  className="footer-Subscribe-btn"
                  onClick={handleSubscribe}
                  element={(
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <span className="p-0">{'Subscribe'}</span>
                      <Image src={ArrowCircleRightImg} alt="arrow" />
                    </div>
                  )}
                  isFilled
                  isGradient
                  disabled={!isValidEmail || isSubscribing }
                /> 
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="horizontal-rule horizontal-line-sub-footer"/>
      <div className="terms-footer-main-wrapper">
            <div className="footer-logo-right-wrapper" >
              <span onClick={() => router.push('/')}>
              <NavLogo />
              </span>
              <div className='footer-logo-right-wrapper-powerby' onClick={() => window.open('https://kalp.studio/', '_blank')}>       
              <Image
                  src={KalpStudioLogo}
                  alt="logo"
                />  
            </div>
            </div>
            
        <span>Copyright © 2024. All rights reserved</span>
        <span className='footer-condition'> Terms & Conditions | Privacy Policy</span>
      </div>
    </div>
      )}
    </>
  );
};

export default FooterSection;
