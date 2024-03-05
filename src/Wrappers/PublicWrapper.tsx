// This component is a wrapper for all public pages. It will redirect to landing page if user is logged in.

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import useEffectOnce from '@/Hooks/useEffectOnce';
import { getAllCategories } from '@/Lib/category/category.action';
import { getAllCurrencies } from '@/Lib/currencies/currencies.action';
import { getAllCurrenciesSelector } from '@/Lib/currencies/currencies.selector';
import { getAllCategorySelector } from '@/Lib/category/category.selector';

interface IPublicWrapperType {
  children: React.ReactNode;
}

const PublicWrapper: React.FC<IPublicWrapperType> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { accessToken } = useAppSelector(authSelector);
  const { currencies } = useAppSelector(getAllCurrenciesSelector);
  const { categories } = useAppSelector(getAllCategorySelector);

  useEffectOnce(() => {
    if (!categories.length) {
      dispatch(getAllCategories({}));
    }

    if (!currencies.length) {
      dispatch(getAllCurrencies());
    }
  });

  if (accessToken) {
    router.push('/');
    return <div />;
  }

  return children
};

export default PublicWrapper;
