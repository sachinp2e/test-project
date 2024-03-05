import React, { useRef, useState } from 'react';
import './favourite.scss';
import Asset from '../../../Assets/_images/catalogs.png';

import Image from 'next/image';
import { CopySvgTwo, VerifiedSign } from '@/Assets/svg';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getAssetFavouriteUserList } from '@/Lib/assetDetail/assetDetail.action';
import { AssetDetailSelector } from '@/Lib/assetDetail/assetDetail.selector';
import useEffectOnce from '@/Hooks/useEffectOnce';
import Button from '@/Components/Button';
import { authSelector } from '@/Lib/auth/auth.selector';
import { getAllUsersSelector } from '@/Lib/users/users.selector';
import axiosInstance from '@/Lib/axios';
import { toastErrorMessage } from '@/utils/constants';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

const FavouiteModal = () => {
  const dispatch:any = useAppDispatch();
  const { AssetDetails, favouriteUserList } =
    useAppSelector(AssetDetailSelector);
  useEffectOnce(() => {
    dispatch(
      getAssetFavouriteUserList({
        id: AssetDetails?.id,
        page: 1,
        pageSize: 30,
      }),
    );
  });
  return (
    <div className="favourite-container">
      {favouriteUserList?.data?.length ? (
        favouriteUserList.data.map((elem: any) => (
          <FavouriteCard element={elem} />
        ))
      ) : (
        <>No data</>
      )}
    </div>
  );
};

export default FavouiteModal;

const FavouriteCard = ({ element }: any) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(
    element?.user?.isFollower,
  );
  const [isDebouncing, setIsdebouncing] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const { id } = useAppSelector(authSelector);
  const { usersData: { userDetails } } = useAppSelector(getAllUsersSelector);

  const handleIdCopyBtn = () => {
    navigator.clipboard.writeText(userDetails?.kalpId);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 2000);
  };

  const handleFollowUnFollowBtn = async () => {
    try {
      if (isDebouncing) {
        return;
      }
      setIsdebouncing(true);
      setTimeout(() => {
        setIsdebouncing(false);
      }, 500);
      const response = await axiosInstance.post(
        '/follower/addAndRemoveFollower',
        {
          followingId: element?.userId,
          isFollow: !isFollowing,
        },
      );
      setIsFollowing(!isFollowing);
    } catch (error: any) {
      toastErrorMessage('Something went wrong!');
    }
  };
  return (
    <div className="favourite-card">
      <div className="leftContent">
        <div className="userImage">
          <Image
            src={element?.user?.profileImage || Asset}
            width={1000}
            height={1000}
            alt=""
          />
        </div>
        <div className="d-flex flex-column">
          <div className="name">
            <b>{element?.user?.userName}</b>{' '}
            {element?.user?.isKycVerified && (
              <VerifiedSign width="20px" height="20px" />
            )}
          </div>
          <div>
            Kalp ID:{' '}
            <b>
              0561...8922D{' '}
              <button
                className="border-0 bg-white"
                onClick={handleIdCopyBtn}
                ref={target}
              >
                <CopySvgTwo />
              </button>
              <Overlay target={target.current} show={show} placement="top">
                {(props) => (
                  <Tooltip id="overlay" {...props} className='copied-tooltip'>
                    Copied
                  </Tooltip>
                )}
              </Overlay>
            </b>
          </div>
        </div>
      </div>
      {element?.userId !== id && (
        <Button
          isFilled={!isFollowing}
          isGradient
          text={isFollowing ? 'Unfollow' : 'Follow'}
          onClick={handleFollowUnFollowBtn}
        />
      )}
    </div>
  );
};
