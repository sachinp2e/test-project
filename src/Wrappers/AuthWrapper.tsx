// this component will be used to wrap all the pages that require authentication and will redirect to the login page if the user is not authenticated

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubNavBar from '@/Components/SubNavBar';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import Footer from '@/Components/Footer';
import useEffectOnce from '@/Hooks/useEffectOnce';
import { getAllCategories } from '@/Lib/category/category.action';
import { getAllCurrencies } from '@/Lib/currencies/currencies.action';
import ScrollToTopButton from '@/Components/scrollToTop';
import { getAllCurrenciesSelector } from '@/Lib/currencies/currencies.selector';
import { getAllCategorySelector } from '@/Lib/category/category.selector';

interface IAuthWrapperType {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<IAuthWrapperType> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { accessToken } = useAppSelector(authSelector);
  const { currencies } = useAppSelector(getAllCurrenciesSelector);
  const { categories } = useAppSelector(getAllCategorySelector);

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken]);

  useEffectOnce(() => {
    if (!categories.length) {
      dispatch(getAllCategories({}));
    }

    if (!currencies.length) {
      dispatch(getAllCurrencies());
    }
  });

  return (
    <>
      <SubNavBar alwaysSticky />
      {children}
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default AuthWrapper;
