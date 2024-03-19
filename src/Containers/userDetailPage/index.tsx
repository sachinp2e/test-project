'use client';
import Image from 'next/image';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from '@/Components/Button';
import UserDetailCards from './UserDetailCards/index';
import ToggleTab from '@/Components/ToggleTab';
import LocalSearchBar from '@/Components/localSearchBar';
import filterIcon from '@/Assets/_images/filter.svg';
import editIcon from '@/Assets/_images/edit-icon-img.svg';
import StarIcon from '../../Assets/_images/star-icone.svg';
import userProfile from '@/Assets/_images/user-profile.png';
import { CopySvgTwo, Discord, FacebookIcon, Instagram, LinkedinIcon, TwitterIcon } from '@/Assets/svg';
import FilterSection from '@/Components/filterSection';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getAllUsersSelector } from '@/Lib/users/users.selector';
import { debounce } from 'lodash';
import { followUnfollowAction } from '@/Lib/users/users.action';
import GenericModal from '@/Components/modal';
import ConnectionsModal from './ConnectionsModal';
import { authSelector } from '@/Lib/auth/auth.selector';
import { helperUseEffectsHook } from './helperUseEffectsHook';
import './users.scss';
import Snackbar from '@/Components/Snackbar';
import ShareOverlay from './ShareOverlay';
import Link from 'next/link';
import { resetUserAssets, updateFollowStatus } from '@/Lib/users/users.slice';
import CustomCopyToClipboard from '@/Components/CopyToClipboard';
import { makeFilterApiCallSelector } from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.selector';
import SkeletonLoading from './UserDetailCards/skeletonLoading';
import userCover from '@/Assets/_images/default-user-cover.svg';

const UserDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'Assets';
  const subTab = searchParams.get('subTab') || 'Collected';

  const { id } = useAppSelector(authSelector);
  const ownProfile: boolean = params?.userId === id;
  const { usersData: { userDetails, userTabDataLoading } } = useAppSelector(getAllUsersSelector);
  const makeApiCall = useAppSelector(makeFilterApiCallSelector);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [connectionsModal, setConnectionsModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>(''); // Followers | Following
  const [showCategory, setShowCategory] = useState<string>(tab);
  const [subCategory, setSubCategory] = useState<string>(subTab);
  const [search, setSearch] = useState<string>('');
  const [subCategoryTabs, setSubCategoryTabs] = useState<string[]>([]);
  const filterColSize = isFilterVisible && isVisible ? 3 : 0;
  const tabs = ownProfile
    ? ['Assets', 'Catalogs', 'Favorites', 'Offers', 'Bids', 'My Drafts', 'Orders', 'History']
    : ['Assets', 'Catalogs', 'Favorites'];
  
  helperUseEffectsHook({
    tab, showCategory, subCategory, search, userId: `${params?.userId}`, makeApiCall,
    setShowCategory, setSubCategory, setSubCategoryTabs, setIsVisible

  });

  const toggleConnectionsModal = (title: string = '') => {
    setModalTitle(title);
    setConnectionsModal((prev) => !prev);
  };

  const handleToggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleMainTabClick = (tab: string) => {
    setShowCategory(tab);
  };

  const handleNestedTabClick = (tab: string) => {
    dispatch(resetUserAssets());
    setSubCategory(tab);
  };

  const handleCopyBtn = (copyString: string) => {
    navigator.clipboard.writeText(copyString);
    setSnackbarMessage('Kalp ID copied !!')
  }

  const handleFollowUnfollow = debounce(async () => {
    await dispatch(
      followUnfollowAction({
        followingId: userDetails?.id,
        isFollow: !userDetails?.isFollower,
      }),
    );
    dispatch(updateFollowStatus({ title: "Profile", followStatus: !userDetails?.isFollower }));
  }, 500);

  const clsHandler = (showCategory: string) => {
    return showCategory === "Bids" || showCategory === "Offers" || showCategory === 'My Drafts' && true
  }
  
  return (
    <>
      <div className="user-container">
        <div className="user-all-details">
          <div className="user-cover">
            <Image
              src={userDetails?.bannerImage || userCover}
              width={2600}
              height={500}
              quality={100}
              alt="user-cover-image"
            />
          </div>
          <div className="profile-col">
            <div className="user-profile">
              <div className="profile-pic">
              { userDetails?.profileImage ? (
                <Image
                  src={ userDetails?.profileImage }
                  alt="profile image"
                  quality={100}
                  height={900}
                  width={900}
                />
              ) : (
                <div className="name-initials">
                  {userDetails?.firstName && userDetails?.firstName[0].toUpperCase()}
                  {userDetails?.lastName && userDetails?.lastName[0].toUpperCase()}
                </div>
              )}
              </div>
              <div className="username">
                <span>{userDetails?.userName}</span>
                {userDetails?.isKycVerified && (
                  <Image src={StarIcon} alt="star icon" />
                )}
              </div>
              <div className="social-icons">
                {userDetails?.instagram &&
                  <Link href={userDetails?.instagram} target='_blank'><Instagram height={34} width={34} /></Link>}
                {userDetails?.twitter &&
                  <Link href={userDetails?.twitter} target='_blank'><TwitterIcon height={34} width={34} /></Link>}
                {userDetails?.discord &&
                  <Link href={userDetails?.discord} target='_blank'><Discord height={34} width={34} /></Link>}
              </div>
              <div className="kalp-id mt-2">
                Kalp ID:{' '}
                <p>
                  {userDetails?.kalpId ?
                    <CustomCopyToClipboard
                      text={userDetails?.kalpId}
                      lastSliceNumber={-5}
                      sliceNumber={4}
                      color={'#C34AC3'}
                    /> : 'Not Assigned Yet'
                  }
                </p>
              </div>
              <div className="user-button-wrapper mt-3">
                {ownProfile ? (
                  <Button
                  className="edit-user-button"
                    element={
                      <span>
                        Edit profile
                    </span>}
                  isGradient
                  onClick={() => router.push(`/settings/editProfile/${params?.userId}`)}
                />
                ) : (
                  <div>
                    <Button
                      className="follow-unfollow-button"
                      text={`${userDetails?.isFollower ? 'Unfollow' : 'Follow'}`}
                      isFilled={!userDetails?.isFollower}
                      isGradient
                      onClick={handleFollowUnfollow}
                      onlyVerifiedAccess
                    />
                  </div>
                )}
                {/* <div className='share-btn-wrapper'>
                 <Button
                  className="share-user-button"
                  element={<Image src={shareIcon} alt="" />}
                  isGradient
                  />
                  <ShareOverlay/>
                </div> */}
              </div>
            </div>
            <div className="user-description">
              <div className="description">
                {userDetails?.bio || ''}
              </div>
              <div className="joined">
                Joined on:{' '}
                <span>
                  {dayjs(userDetails?.first_login).format('D MMMM YYYY')}
                </span>
              </div>
              <div className="follower-following">
                <div
                  className="followers"
                  onClick={() => {
                    toggleConnectionsModal('Followers');
                  }}
                >
                  <span>Followers</span>
                  <span>{userDetails?.followerCount}</span>
                </div>
                <div
                  className="followers"
                  onClick={() => {
                    toggleConnectionsModal('Following');
                  }}
                >
                  <span>Following </span>
                  <span>{userDetails?.followingCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="custom-tabs">
          <ToggleTab
            tabs={tabs}
            activeToggle={showCategory}
            handleTabClick={handleMainTabClick}
          />
        </div>
        <div className={`local-searchbar-row ${clsHandler(showCategory) ? 'local-searchbar-row-hidden' : ''}`}>
          <div className="col-3 pe-4">{isVisible && <LocalSearchBar handleSearch={setSearch} />}</div>
          <div className="custom-toogle-tab">
            <ToggleTab
              tabs={subCategoryTabs}
              activeToggle={subCategory || ''}
              handleTabClick={handleNestedTabClick}
            />
          </div>
        </div>
      </div>
      <div className="user-tabs-cards">
        {isVisible && !isFilterVisible && !(showCategory === 'Catalogs' || subCategory === 'Catalogs') && (
          <Button
            className="filter-button"
            onClick={handleToggleFilter}
            element={
              <div>
                <Image src={filterIcon} alt="" />
              </div>
            }
          />
        )}
        <div className={`user-tabs-filter-container`}>
          <Row>
            {isVisible && isFilterVisible && !(showCategory === 'Catalogs' || subCategory === 'Catalogs') && (
              <Col lg={filterColSize}>
                <FilterSection
                  handleToggleFilter={handleToggleFilter}
                  isFilterVisible={isFilterVisible}
                />
              </Col>
            )}
            <Col lg={12 - filterColSize}>
              {userTabDataLoading && (showCategory !== 'Orders' && showCategory !== 'History') ? <SkeletonLoading/> :
              <UserDetailCards subCategory={subCategory || ''} showCategory={showCategory} search={search} />}
            </Col>
          </Row>
        </div>
        {/* Followers/Following List */}
        <GenericModal
          show={connectionsModal}
          onHide={toggleConnectionsModal}
          title={modalTitle}
          body={<ConnectionsModal title={ modalTitle } ownProfile={ownProfile} triggerCopyMessage={handleCopyBtn}/>}
          className="connections-modal"
          close={true}
        />
        <Snackbar message={snackbarMessage} resetMessage={setSnackbarMessage}/>
      </div>
    </>
  );
};
export default UserDetailPage;
