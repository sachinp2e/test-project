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
import userCover from '../../Assets/_images/user-cover.png';
import editIcon from '@/Assets/_images/edit-icon-img.svg';
import StarIcon from '../../Assets/_images/star-icone.svg';
import { updateCurrentUserTab } from '@/Lib/users/users.slice';
import userProfile from '@/Assets/_images/user-profile.png';
import { CopySvgTwo, Discord, FacebookIcon, Instagram, LinkedinIcon, TwitterIcon } from '@/Assets/svg';
import FilterSection from '@/Components/filterSection';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { updateFollowStatus } from '@/Lib/users/users.slice';
import CustomCopyToClipboard from '@/Components/CopyToClipboard';
import { makeFilterApiCallSelector } from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.selector';

const dropDownItemsArr = [
  { label: 'My Drafts', value: 'My Drafts' },
  { label: 'Orders', value: 'Orders' },
  { label: 'History', value: 'History' },
];

const UserDetailPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useAppDispatch();

  const tab = searchParams.get('tab') || 'Assets';

  const { id } = useAppSelector(authSelector);
  const ownProfile: boolean = params?.userId === id;
  const { usersData: { userDetails } } = useAppSelector(getAllUsersSelector);
  const makeApiCall = useAppSelector(makeFilterApiCallSelector);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [connectionsModal, setConnectionsModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>(''); // Followers | Following
  const [subCategory, setSubCategory] = useState<string>('Collected');
  const [showCategory, setShowCategory] = useState<string>(tab);
  const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [subCategoryTabs, setSubCategoryTabs] = useState<string[]>(['Collected', 'Created']);
  const filterColSize = isFilterVisible && isVisible ? 3 : 0;
  const tabs = ownProfile
    ? ['Assets', 'Catalogs', 'Favourites', 'Offers', 'Bids', 'My Drafts', 'Orders', 'History']
    : ['Assets', 'Catalogs', 'Favourites'];

  helperUseEffectsHook({
    showCategory, subCategory, search, userId: `${params?.userId}`, makeApiCall,
    setSubCategory, setSubCategoryTabs, setIsVisible, setDropDownVisible
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
    dispatch(updateCurrentUserTab(tab));
    window.history.pushState({ path: `${pathName}?tab=${tab}` }, '', `${pathName}?tab=${tab}`);
  };

  const handleNestedTabClick = (tab: string) => {
    setDropDownVisible(false);
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
                <Image
                  src={userDetails?.profileImage || userProfile}
                  width={600}
                  height={600}
                  quality={100}
                  alt="user-profile-image"
                />
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
                  onlyVerifiedAccess
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
            dropDownItemsArr={dropDownItemsArr}
            dropDownVisible={dropDownVisible}
            handleDropDownClick={handleNestedTabClick}
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
      <div className="explore-cards">
        {isVisible && !isFilterVisible && (tab !== 'Catalogs') && (
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
        <div className={`explore-filter-container`}>
          <Row className="m-0">
            {isVisible && isFilterVisible && (tab !== 'Catalogs') && (
              <Col lg={filterColSize} className="pe-4 ps-0 pb-1">
                <FilterSection
                  handleToggleFilter={handleToggleFilter}
                  isFilterVisible={isFilterVisible}
                />
              </Col>
            )}
            <Col lg={isVisible ? 12 - filterColSize : 12} className="p-0">
              <UserDetailCards
                subCategory={subCategory || ''}
                showCategory={showCategory}
                search={search}
              />
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
