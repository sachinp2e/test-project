'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/Components/Button';
import { Vector2SVG } from '@/Assets/svg';
import ArrowCircleRightImg from '@/Assets/_images/arrow-circle-right.svg';
import EnglishUKImg from '@/Assets/_images/english-flag.png';
import ArabicARABImg from '@/Assets/_images/arabic-flag.png';
import { IOption } from '../../CustomSelect';
import SpanishSPAINImg from '@/Assets/_images/spanish-flag.png';
import CustomSelect from '../../CustomSelect';
import { authSelector } from '@/Lib/auth/auth.selector';
import { useAppSelector } from '@/Lib/hooks';
import './mobileFooterSection.scss';
import { getAllCategorySelector } from '@/Lib/category/category.selector';
import { debounce } from 'lodash';
import { toastErrorMessage, toastSuccessMessage } from '@/utils/constants';
import { useRouter } from 'next/navigation';

const menuItems = [
  {
    label: <span className="flag-icon"><Image src={EnglishUKImg}  alt='' />English</span>,
    value: 'English',
  },
  {
    label: <span className="flag-icon"><Image src={ArabicARABImg}  alt='' />Arabic</span>,
    value: 'Arabic',
  },
  {
    label: <span className="flag-icon"><Image src={SpanishSPAINImg} alt='' />Spanish</span>,
    value: 'Spanish',
  },
];

const MobileFooterSection = () => {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string>('')

  const handleSelectChange = (name: string, option: IOption) => {
      setSelectedOptions(option.value);
  };
  const { userId, userDetails } = useAppSelector(authSelector);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showMyAccount, setShowMyAccount] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const { categories } = useAppSelector(getAllCategorySelector);

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [email, setEmail] = useState('');

  const validateEmail = (email: string) => {
    const regex =/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const debouncedSubscribe = debounce((email: string) => {
    setIsSubscribing(true);
    setIsSubscribing(false);
  }, 1000);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setIsValidEmail(validateEmail(emailValue));
    debouncedSubscribe(emailValue);
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
          debouncedSubscribe(email);
          toastSuccessMessage(
            'Congratulations! You have subscribe to the newsletter',
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
  
  const toggleDropdown = (section:string) => {
    switch (section) {
      case 'Marketplace':
        setShowMarketplace(!showMarketplace);
        setShowMyAccount(false);
        setShowCompany(false);
        break;
      case 'My Account':
        setShowMyAccount(!showMyAccount);
        setShowMarketplace(false);
        setShowCompany(false);
        break;
      case 'Company':
        setShowCompany(!showCompany);
        setShowMarketplace(false);
        setShowMyAccount(false);
        break;
      default:
        setShowMarketplace(false);
        setShowMyAccount(false);
        setShowCompany(false);
        break;
    }
  };

  return (
    <div className="mobile-footer-main-wrapper">
      <div className="sub-footer-main-wrapper">
        <div className="section-footer">
          <div className="title-footer" onClick={() => toggleDropdown('Marketplace')}>
            <span >Marketplace</span>
            <span><Vector2SVG/></span>
          </div>
          {showMarketplace && (
          <div className="mobile-options-footer">
              <ul>
              {categories.map((category: any) => (
              <li key={category.id}>
                <p className='categories'
                  onClick={() => { router.push(`/explore/assets?category=${category?.name}&id=${category?.id}`); }}>
                  {category.name}
                </p>
              </li>
            ))}
          </ul>
          </div>)}
        </div>
        <div className="section-footer">
          <div className="title-footer" onClick={() => toggleDropdown('My Account')}>
            <span>My Account</span>
            <span><Vector2SVG/></span>
          </div>
          {showMyAccount && (
          <div className="mobile-options-footer">
            <ul>
              <li>
                <p className='categories' onClick={() => { router.push(`/user/${userDetails?.id}?tab=Assets&subTab=Collected`); }}>Profile</p>
              </li>
              <li>
                <p className='categories' onClick={() => { router.push(`/user/${userDetails?.id}?tab=Favorites&subTab=Assets`); }}>Favorites</p>
              </li>
              <li>
                <p className='categories' onClick={() => { router.push(`/settings/myWallet/${userId}`); }}>Wallet</p>
              </li>
              <li>
                <p className='categories' onClick={() => { router.push(`/user/${userDetails?.id}?tab=Catalogs`); }}>Catalogs</p>
              </li>
              <li>
                <p className='categories' onClick={() => { router.push(`/settings/editProfile/${userId}`); }}>Settings</p>
              </li>
            </ul>
          </div>)}
        </div>
        <div className="section-footer">
      
            <div className="title-footer" onClick={() => toggleDropdown('Company')}>
              <span>Company</span>
              <span><Vector2SVG/></span>
            </div>
            {showCompany && (
            <div className="mobile-options-footer">
              <ul>
                <li>
                  <Link href="/#">About Us</Link>
                </li>
                <li>
                  <Link href="/#">Contact Us</Link>
                </li>
              </ul>
            </div>)}
          
          <div>
            
          </div>
          
        </div>
        <div className="section-footer select-langanguage">
        <div className="title-footer ">
              <span>Select Language</span>
            
            
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
        <div className="section-footer footer-wrapper">
          <div className="title-footer">
            <span>Subscribe to our Newsletter</span>
          </div>
          <div className="mobile-options-footer">
            <div className='footer-subscribe'>
            <span>
                  <input type="text" placeholder="Enter your email address..." value={email} onChange={handleEmailChange} />
                  
                </span>
                <span className='mobile-subscribe-wrapper'>
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
                    disabled={!isValidEmail || isSubscribing}
                  />
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default MobileFooterSection;
