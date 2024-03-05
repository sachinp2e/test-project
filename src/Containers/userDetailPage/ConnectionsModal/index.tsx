import React from 'react';
import './connections.scss';
import Asset from '../../../Assets/_images/catalogs.png';
import Image from 'next/image';
import { CopySvgTwo, VerifiedSign } from '@/Assets/svg';
import Button from '@/Components/Button';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { debounce } from 'lodash';
import { followUnfollowAction, getAllUserFollowers, getAllUserFollowing } from '@/Lib/users/users.action';
import { useParams, useRouter } from 'next/navigation';
import { getAllUsersSelector } from '@/Lib/users/users.selector';
import useEffectOnce from '@/Hooks/useEffectOnce';
import InfiniteScroll from 'react-infinite-scroll-component';
import { updateFollowStatus } from '@/Lib/users/users.slice';
import CustomCopyToClipboard from '@/Components/CopyToClipboard';

interface IConnectionsModal {
  title: string; // Followers | Following
  ownProfile: boolean;
  triggerCopyMessage: (copyString: string) => void;
}

  export interface IFollower {
    id: string;
    followerId: string;
    followingId: string;
    isFollow: boolean;
    isFollower: boolean;
    follower: {
      id: string;
      authId: string;
      firstName: string;
      lastName: string;
      userName: string;
      bio: string;
      email: string;
      phone: string;
      followerCount: number;
      followingCount: number;
      website: string;
      instagram: string;
      twitter: string;
      discord: string;
      kalpId: string;
      profileImage: string;
      bannerImage: string;
      isKycVerified: boolean;
      kycStatus: string;
      kycId: string;
      blockchainEnrolmentId: string;
      blockChainKycId: string;
      mai_wallet_id: string;
      first_login: string;
      last_login: string;
      isSuspend: boolean;
      isOtpDisabled: boolean;
      profileImage_resized: string;
    };
  }

  export interface IFollowing {
    id: string;
    followerId: string;
    followingId: string;
    isFollow: boolean;
    isFollower: boolean;
  following: {
    id: string;
    authId: string;
    firstName: string;
    lastName: string;
    userName: string;
    bio: string;
    email: string;
    phone: string;
    followerCount: number;
    followingCount: number;
    website: string;
    instagram: string;
    twitter: string;
    discord: string;
    kalpId: string;
    profileImage: string;
    bannerImage: string;
    isKycVerified: boolean;
    kycStatus: string;
    kycId: string;
    blockchainEnrolmentId: string;
    blockChainKycId: string;
    mai_wallet_id: string;
    first_login: string;
    last_login: string;
    isSuspend: boolean;
    isOtpDisabled: boolean;
    profileImage_resized: string;
  };
}

const ConnectionsModal: React.FC<IConnectionsModal> = ({title, triggerCopyMessage, ownProfile}) => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    usersData: { userFollowers: { followers = [], hasMore: hasMoreFollowers, latestPage: latestPageFollowers },
      userFollowing: { following = [], hasMore: hasMoreFollowing, latestPage: latestPageFollowing }, loading },
  } = useAppSelector(getAllUsersSelector);

  useEffectOnce(() => {
    if (title === 'Followers' && !followers?.length) {
      dispatch(getAllUserFollowers({userId: `${params?.userId}`}))
    } else if (title === 'Following' && !following?.length) {
      dispatch(getAllUserFollowing({userId: `${params?.userId}`}))
    }
  })

  const handleFollowUnfollow = debounce(async (followingId: string, isFollow: boolean) => {
    await dispatch(
      followUnfollowAction({
        followingId: followingId,
        isFollow: !isFollow,
      }),
    );
    dispatch(updateFollowStatus({ title: title, userId: followingId, followStatus: !isFollow, ownProfile: ownProfile }));
  }, 500);

  const fetchMoreData = () => {
    if (title === 'Followers') {
      dispatch(
        getAllUserFollowers({
          userId: `${params?.userId}`,
          latestPage:
            Number(latestPageFollowers) + 1,
          loadMore: true,
        }),
      );
    } else if (title === 'Following') {
      dispatch(
        getAllUserFollowing({
          userId: `${params?.userId}`,
          latestPage: Number(latestPageFollowing) + 1,
          loadMore: true,
        }),
      );
    }
  }

  const getDataLengthAndHasMore = () => {
    if (title === 'Followers') {
      return {
        dataLength: followers.length,
        hasMore: hasMoreFollowers,
      };
    } else if (title === 'Following') {
      return {
        dataLength: following.length,
        hasMore: hasMoreFollowing,
      };
    } else {
      return {
        dataLength: 0,
        hasMore: false,
      }
    }
  }
  const { dataLength, hasMore } = getDataLengthAndHasMore();

  if (
    (title === 'Followers' && followers?.length === 0) ||
    (title === 'Following' && following?.length === 0)
  ) {
    return (
      <div className="d-flex align-items-center justify-content-center mt-3">
        <div style={{ fontSize: '48px', color: '#ddd' }}>{loading ? `Loading ⏳` : `No ${title}`}</div>
      </div>
    );
  }

  return (
    <div className="connections-container" id="connections-container">
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<></>}
        scrollableTarget="connections-container">
        {title === 'Followers' && (followers).map((follower: IFollower) => (
        <div key={follower?.id}>
          <div className="connections-card">
            <div className="leftContent">
              <div className="userImage" onClick={()=> router.push(`/user/${follower?.follower?.id}?tab=Assets`)}>
                  <Image src={follower?.follower?.profileImage_resized || follower?.follower?.profileImage || Asset}
                    alt="NA" width={100} height={100} quality={100} />
              </div>
              <div className="d-flex flex-column">
                <div className="name">
                    <b onClick={() => router.push(`/user/${follower?.follower?.id}?tab=Assets`)}>
                      {follower?.follower?.userName}
                    </b>
                    <VerifiedSign width="20px" height="20px" />
                </div>
                <div className="kalp-id">
                  Kalp ID:{' '}
                  <b>
                    {follower?.follower?.kalpId ?
                      <CustomCopyToClipboard
                        text={follower?.follower?.kalpId}
                        lastSliceNumber={-5}
                        sliceNumber={4}
                        color={'#C34AC3'}
                      /> : 'Not Assigned Yet'
                    }
                  </b>
                </div>
              </div>
            </div>
            <div className="rightContent" >
              <Button
                className="follow-unfollow-button"
                text={`${follower?.isFollower ? 'Unfollow' : 'Follow'}`}
                isFilled={!follower?.isFollower}
                isGradient
                onClick={() => handleFollowUnfollow(follower?.followerId, follower?.isFollower)}
                onlyVerifiedAccess/>
            </div>
          </div>
          <hr />
       </div>
      ))}
        {title === 'Following' && (following).map((following: IFollowing) => (
        <div key={following?.id}>
          <div className="connections-card">
            <div className="leftContent">
              <div className="userImage" onClick={() => router.push(`/user/${following?.following?.id}?tab=Assets`)}>
                <Image src={following?.following?.profileImage_resized || following?.following?.profileImage || Asset} alt="NA" width={100} height={100} quality={100}/>
              </div>
              <div className="d-flex flex-column">
                <div className="name">
                    <b onClick={() => router.push(`/user/${following?.following?.id}?tab=Assets`)}>
                      {following?.following?.userName}
                    </b>
                    <VerifiedSign width="20px" height="20px" />
                </div>
                <div className="kalp-id">
                  Kalp ID:{' '}
                  <b>
                  {following?.following?.kalpId ?
                    <CustomCopyToClipboard
                      text={following?.following?.kalpId}
                      lastSliceNumber={-5}
                      sliceNumber={4}
                      color={'#C34AC3'}
                    /> : 'Not Assigned Yet'
                  }
                  </b>
                </div>
              </div>
            </div>
            <div className="rightContent" onClick={() => handleFollowUnfollow(following?.followingId, following?.isFollower)}>
              <Button
                className="follow-unfollow-button"
                text={`${following?.isFollower ? 'Unfollow' : 'Follow'}`}
                isFilled={!following?.isFollower}
                isGradient
                onlyVerifiedAccess
              />
            </div>
          </div>
          <hr />
        </div>
      ))}
      </InfiniteScroll>
    </div>
  );
};

export default ConnectionsModal;
