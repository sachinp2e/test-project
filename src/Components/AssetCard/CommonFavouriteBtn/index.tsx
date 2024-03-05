import './favourite.scss'
import axiosInstance from '@/Lib/axios';
import { toastErrorMessage } from '@/utils/constants';
import React from 'react';
import { IoIosHeart } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { updateExploreFavAssets } from '@/Lib/assets/assets.slice';
import { updateUserPageFavAssets } from '@/Lib/users/users.slice';
import debounce from 'lodash/debounce';
import { updateCatalogFavAssets } from '@/Lib/catalogs/catalogs.slice';
import { getAllUsersSelector } from '@/Lib/users/users.selector';

type Props = { assetId: string; isFavourite: boolean|string };

const CommonFavouriteBtn = (props: Props) => {
  const { assetId, isFavourite } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userId = "", id = "" } = useParams();

  const { userDetails } = useAppSelector(authSelector);
  const { usersData: { currentUserTab } } = useAppSelector(getAllUsersSelector);
  
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
        { assetId, isFavourite: !isFavourite },
      );
      if (userId) {
        switch (currentUserTab) {
          case "Assets":
            dispatch(
              updateUserPageFavAssets({
                tab: currentUserTab,
                assetId: assetId,
                isLike: !isFavourite,
              }),
            )
            break;
          case "Favourites":
            dispatch(
              updateUserPageFavAssets({
                tab: currentUserTab,
                assetId: assetId,
                isLike: !isFavourite,
              }),
            )
            break;
          case "Offers":
            dispatch(
              updateUserPageFavAssets({
                tab: currentUserTab,
                assetId: assetId,
                isLike: !isFavourite,
              }),
            )
            break;
          case "Bids":
            dispatch(
              updateUserPageFavAssets({
                tab: currentUserTab,
                assetId: assetId,
                isLike: !isFavourite,
              }),
            )
            break;
          default:
            break;
        }
      }
      else if (id) {
        dispatch(
          updateCatalogFavAssets({
            assetId: assetId,
            isLike: !isFavourite,
          }),
        )
      } else {
        dispatch(
          updateExploreFavAssets({
            assetId: assetId,
            isLike: !isFavourite,
          }),
        );
      }
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
        {isFavourite ? (
          <IoIosHeart size={20} className="heart-red" />
        ) : (
          <IoIosHeart size={20} />
        )}
      </div>
    </>
  );
};

export default CommonFavouriteBtn;
