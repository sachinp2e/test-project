import React from 'react';
import Image from 'next/image';
import Button from '../Button';
import ExploreUserAvatar from '../../Assets/_images/top-catalog-avatar.jpg';
import ExploreUserBanner from '../../Assets/_images/explore-user-img.jpg';
import './style.scss';
import StarIcon from '../../Assets/_images/star-icone.svg';
import { IUsers } from '@/Lib/users/usersInterface';
import { followUnfollowAction } from '@/Lib/users/users.action';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { updateFollowStatus } from '@/Lib/users/users.slice';
import { authSelector } from '@/Lib/auth/auth.selector';
import userCover from '@/Assets/_images/default-user-cover.svg';


interface IUserCard {
  cardData: IUsers;
}

const UserCard: React.FC<IUserCard> = ({ cardData }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userId, userDetails } = useAppSelector(authSelector);

  const handleFollowUnfollow = debounce(async () => {
    await dispatch(
      followUnfollowAction({
        followingId: cardData?.id,
        isFollow: !cardData?.isFollower,
      }),
    );
    dispatch(updateFollowStatus({ title:"User Card", userId:cardData?.id, followStatus: !cardData?.isFollower }))
  }, 500);

  return (
    <div className="explore-user-img-main-wrapper">
      <div className="explore-user-img">
        <Image
          src={cardData?.bannerImage || userCover}
          className="sub-explore-user-img"
          alt="Cover image"
          width="1220"
          height="640"
          quality={100}
        />
      </div>
      <div className="explore-user-text">
        <div className="sub-explore-user-text">
          <span>{cardData?.userName}</span>
          {cardData?.isKycVerified && <Image src={StarIcon} alt="" />}
        </div>
      </div>
      <div className="explore-user-avatar">
        {cardData?.profileImage ? (
        <Image
          src={cardData?.profileImage || ExploreUserAvatar}
          className="sub-explore-user-img"
          alt="Profile Image"
          width="200"
          height="200"
          quality={100}
        />):(
            <div className="name-initials">
              {cardData?.firstName && cardData?.firstName[0].toUpperCase()}
              {cardData?.lastName && cardData?.lastName[0].toUpperCase()}
            </div>
          )}
      </div>
      <div className="explore-user-overlay">
        <div className="sub-explore-user-overlay">
          <div
            className="title-explore-user"
            onClick={() => router.push(`/user/${cardData?.id}`)}
          >
            {cardData?.profileImage ? (
            <Image
              src={cardData?.profileImage}
              width="200"
              height="200"
              quality={100}
              alt=" "
            />
            ):(
              <div className="name-initials">
                  {cardData?.firstName && cardData?.firstName[0].toUpperCase()}
                  {cardData?.lastName && cardData?.lastName[0].toUpperCase()}
                </div>
              )}
            <div onClick={() => router.push(`/user/${cardData?.id}`)}>
              <span>{cardData?.userName}</span>
              {cardData?.isKycVerified && <Image src={StarIcon} alt="" />}
            </div>
          </div>
          <div className="footer-explore-user">
            <div className="followers-footer-explore-user">
              <h6>Followers</h6>
              <span>{cardData?.followerCount}</span>
            </div>
            <div className="vertical-line-footer-explore-user" />
            <div className="followers-footer-explore-user">
              <h6>Following</h6>
              <span>{cardData?.followingCount}</span>
            </div>
          </div>
          <div className="footer-button">
            {userDetails?.authId === cardData?.authId && (
              <div className="footer-button">
                {cardData?.isFollower !== undefined && (
                  <Button
                    className="follow-unfollow-button"
                    text={`${cardData?.isFollower ? 'Unfollow' : 'Follow'}`}
                    isFilled={!cardData?.isFollower}
                    onClick={handleFollowUnfollow}
                    isGradient
                    onlyVerifiedAccess
                  />
                )}
              </div>
            )}
            {userDetails?.authId !== cardData?.authId && (
              <div className="footer-button">
                <Button
                  className="follow-unfollow-button"
                  text={`${cardData?.isFollower ? 'Unfollow' : 'Follow'}`}
                  isFilled={!cardData?.isFollower}
                  onClick={handleFollowUnfollow}
                  isGradient
                  onlyVerifiedAccess
                />
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
