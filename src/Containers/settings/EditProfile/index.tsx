import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Button from '../../../Components/Button/index';
import ProfileForm from '@/Containers/settings/EditProfile/profileForm';
import userProfile from '@/Assets/_images/user-profile.png';
import userCover from '@/Assets/_images/default-user-cover.svg';
import { useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import './style.scss';
import dayjs from 'dayjs';
import { EditIcon, TrashleIcon } from '@/Assets/svg';
import { toastErrorMessage } from '@/utils/constants';

interface IEditProfileType {
}

const EditProfile: React.FC<IEditProfileType> = () => {
  const { userDetails } = useAppSelector(authSelector);

  const editProfileImageRef = useRef<HTMLInputElement | null>(null);
  const editCoverRef = useRef<HTMLInputElement | null>(null);

  const [coverImage, setCoverImage] = useState<null|File>(null);
  const [profileImage, setProfileImage] = useState<File|null>(null);

  const handleCoverUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const maxSize = 4 * 1024 * 1024;
    if (file) {
      const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedFormats.includes(file.type)) {
        toastErrorMessage(
          'Invalid file format. Please upload a JPG, JPEG or PNG image.',
        );
        return;
      } else if (file.size > maxSize) {
        toastErrorMessage('Image size exceeds the maximum limit of 4MB.');
        return;
      }
      setCoverImage(file);
      event.target.value = '';
    }
  };

  const handleProfileImageUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const maxSize = 5 * 1000 * 1000;
  
    if (file) {
      if (file.size > maxSize) {
        toastErrorMessage('Please upload a profile image that is not more than 5MB in size.');
        setProfileImage(null);
        return;
      }
  
      const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedFormats.includes(file.type)) {
        toastErrorMessage('Invalid file format. Please upload a JPG, JPEG, PNG or GIF image.');
        setProfileImage(null); 
        return;
      }
  
      setProfileImage(file);
      event.target.value = '';
    }
  };
  

  return (
    <>
    <div className="user-cover-image">
      {<Image
        src={
          coverImage
          ? URL.createObjectURL(coverImage)
              : userDetails?.bannerImage
                ? userDetails?.bannerImage
                  : userCover
        }
        alt="banner image"
        quality={100}
        width={2000}
        height={2000}
      />}
      <div className="edit-btn-wrapper">
        <input
          ref={editCoverRef}
          type="file"
          name="banner-update"
          className="d-none"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleCoverUpdate}
        />
        <button
          className="edit-btn-icon"
          onClick={() => {
            if (editCoverRef.current) {
              editCoverRef.current.click();
            }
          }}
        >
          <EditIcon />
        </button>
        {coverImage && (
          <button
            className="trash-btn-icon"
            onClick={() => {
              setCoverImage(null);
            }}
          >
            <TrashleIcon height="20" width="20" color="#e3d9e5" />
          </button>
        )}
      </div>
    </div>
    <div className="edit-profile">
      <div className="photo-section">
        <div className="image-preview-section">
          <div className="circular-image-preview">
            {
              (profileImage || userDetails?.profileImage) ? (
                <Image
                  src={
                    profileImage
                      ? URL.createObjectURL(profileImage)
                      : (userDetails?.profileImage || '')
                  }
                  alt="profile image"
                  quality={100}
                  height={900}
                  width={900}
                />
              ) : (
                <div className="name-initials">
                  {userDetails?.firstName && userDetails?.firstName[0]}
                  {userDetails?.lastName && userDetails?.lastName[0]}
                </div>
              )
            }
          </div>
          <input
            ref={editProfileImageRef}
            type="file"
            name="profile-update"
            className="d-none"
            accept="image/png, image/jpeg, image/jpg, image/gif"
            onChange={handleProfileImageUpdate}
          />
          <Button
            className="upload-photo-btn"
            element={
              <div className="d-flex align-items-center">
                <span>Upload new photo</span>
              </div>
            }
            onClick={() => {
              if (editProfileImageRef.current) {
                editProfileImageRef.current.click();
              }
            }}
            isFilled
            isGradient
          />
          {profileImage && (
            <Button
              className="delete-photo-btn"
              element={
                <div className="d-flex align-items-center">
                  <span
                    onClick={() => {
                      setProfileImage(null);
                    }}
                  >
                    Delete
                  </span>
                </div>
              }
              isGradient
            />
          )}
        </div>
      </div>
      <div className="account-creation-details">
        <p>
          Account created on:{' '}
          <b>{dayjs(userDetails?.created_at).format('D MMMM YYYY')}</b>
        </p>
      </div>
      {userDetails?.id && <ProfileForm coverImage={coverImage} setCoverImage={setCoverImage} profileImage={ profileImage} setProfileImage={setProfileImage}/>}
    </div>
    </>
  );
};

export default EditProfile;
