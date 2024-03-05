'use client';

import React from 'react';
import { NextPage } from 'next';
import { useParams, useRouter } from 'next/navigation';
import useEffectOnce from '@/Hooks/useEffectOnce';
import axiosInstance from '@/Lib/axios';
import { useAppDispatch } from '@/Lib/hooks';
import { loginWithToken } from '@/Lib/auth/auth.slice';
import ResultModal from '@/Components/ResultModal';
import './style.scss';

const AssetsPage: NextPage = () => {
  const router = useRouter();
  const { id }: any = useParams();
  const dispatch = useAppDispatch();

  const [error, setError] = React.useState<boolean>(false);

  const authenticateUser = async () => {
    try {
      const response = await axiosInstance.get(`/user/verify_redirect_token/${id}`);
      if (response.data) {
        localStorage.setItem('accessToken', response?.data?.result?.access_token);
        localStorage.setItem('refreshToken', response?.data?.result?.refresh_token);
        localStorage.setItem('userId', response?.data?.result?.userId);
        localStorage.setItem('id', response?.data?.result?.id);
        dispatch(loginWithToken(response.data));
        router.push(response.data.result.redirectRoute);
      } else {
        setError(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(true);
    }
  };

  useEffectOnce(() => {
    authenticateUser();
  });

  const onProceed = () => {
    router.push('/login');
  };

  if (!error) {
    return (
      <div className="loader-wrapper">
        <div className="loader" />
      </div>
    );
  }

  return (
    <>
      <ResultModal
        onProceed={onProceed}
        text="Invalid token"
        type="FAILURE"
        description="The token is invalid or expired. Please try again."

      />
    </>
  );
};

export default AssetsPage;
