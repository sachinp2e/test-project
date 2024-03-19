import './favourite.scss'
import axiosInstance from '@/Lib/axios';
import { toastErrorMessage } from '@/utils/constants';
import React, { useState } from 'react';
import { IoIosHeart } from 'react-icons/io';
import { useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';

type Props = { assetId: string; isFavourite: boolean|string };

const CommonFavouriteBtn = (props: Props) => {
  const router = useRouter();

  const { assetId, isFavourite } = props;
  const { userDetails } = useAppSelector(authSelector);

  const [fav, setFav] = useState<boolean | string>(isFavourite);
  
  const handleLikeUnlikeBtn = debounce(async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userDetails.id) {
      router.push('/login');
      return;
    }  
    try {
      const response = await axiosInstance.post(
        '/favourite/addAndRemoveFavouriteAsset',
        { assetId, isFavourite: !fav },
      );
      setFav(prev => !prev)
    } catch (error: any) {
      toastErrorMessage('Something went wrong');
    }
  }, 500);

  if (isFavourite === 'hide') {
    return <></>
  }
  
  return (
    <>
      <div
        className="card-favourite-btn"
        onClick={handleLikeUnlikeBtn}
        style={{ cursor: 'pointer' }}
      >
        {fav ? (
          <IoIosHeart size={20} className="heart-red" />
        ) : (
          <IoIosHeart size={20} />
        )}
      </div>
    </>
  );
};

export default CommonFavouriteBtn;
