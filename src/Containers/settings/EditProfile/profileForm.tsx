import React, { useState } from 'react';
import * as Yup from 'yup';
import Image from 'next/image';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import TextField from '@/Components/Textfield';
import GenericTextArea from '../../../Components/textarea/index';
import StarIcon from '../../../Assets/_images/star-icone.svg';
import { Dropdown } from 'react-bootstrap';
import { Arrow } from '@/Assets/svg';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import Button from '@/Components/Button';
import GenericModal from '@/Components/modal';
import ChangePassword from './changePassword/changePassword';
import { updateProfileAction } from '@/Lib/auth/auth.action';
import CustomModal from '@/Components/CustomModal';
import SuccessToaster from '@/Assets/_images/sucess-animation.gif';

interface IProfileForm {
  coverImage: null | File;
  profileImage: null | File;
  setCoverImage: (value: null | File) => void;
  setProfileImage: (value: null | File) => void;
}

interface IProfileData {
  [key: string]: string;
  fullName: string;
  userName: string;
  email: string;
  phone: string;
  bio: string;
  twitter: string;
  instagram: string;
  discord: string;
  website: string;
}

const menuItems = [
  {
    label: 'IN',
    value: '+91',
  },
  {
    label: 'US',
    value: '+41',
  },
  {
    label: 'Uk',
    value: '+25',
  },
];

const profileValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(25, 'Name must not exceed 25 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only alphabets')
    .test(
      'name',
      'Display name should have Firstname and Lastname',
      (value) => {
        // check firstName and lastName as required
        if (value) {
          const nameArray = value
            .split(' ')
            .filter((name) => name !== '' && name !== ' ');
          if (nameArray.length < 2) {
            return false;
          }
        }
        return true;
      },
    )
    // check if name does not contain any special characters
    .test(
      'name',
      'Last Name should not contain special characters',
      (value) => {
        if (value) {
          // const nameArray = value.split(' ').filter((name) => name !== '' && name !== ' ');
          const nameArray = value.substring(value.indexOf(' '));
          const regex = /^[a-zA-Z]+$/;
          return regex.test(nameArray.substring(1) || '');
        }
        return true;
      },
    )
    .required('Name is required'),
  userName: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Invalid phone number')
    .notRequired(),
  bio: Yup.string()
    .notRequired()
    .max(160, 'Bio must be atleast 160 characters'),
  twitter: Yup.string()
    .matches(/^https:\/\/twitter\.com\/.*$/, 'Invalid URL')
    .notRequired(),
  instagram: Yup.string()
    .matches(/^https:\/\/www\.instagram\.com\/.*$/, 'Invalid URL')
    .notRequired(),
  discord: Yup.string().notRequired(),
  website: Yup.string()
    .matches(
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Invalid URL',
    )
    .notRequired(),
});

const ProfileForm = ({
  coverImage,
  profileImage,
  setCoverImage,
  setProfileImage,
}: IProfileForm) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector(authSelector);

  const [globalError, setGlobalError] = useState('');
  const [open, setOpen] = useState(false);
  const [canUpdateUsername, setCanUpdateUsername] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(
    menuItems[0],
  );
  const [showPasswordModal, togglePasswordModal] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);

  const initialValues: IProfileData = {
    fullName:
      `${userDetails?.firstName || ''} ${userDetails?.lastName || ''}` || '',
    userName: userDetails?.userName || '',
    email: userDetails?.email || '',
    phone: userDetails?.phone || '',
    bio: userDetails?.bio || '',
    twitter: userDetails?.twitter || '',
    instagram: userDetails?.instagram || '',
    discord: userDetails?.discord || '',
    website: userDetails?.website || '',
  };

  const handleUpdate = (values: IProfileData) => {
    if (values.fullName.split(' ').length < 2) {
      formik.setFieldError(
        'fullName',
        'Display name should have Firstname and Lastname',
      );
      return;
    }
    const updatedFieldsObj = Object.entries(values).reduce(
      (acc: any, [key, value]) => {
        if (initialValues[key] !== value) {
          if (key === 'fullName') {
            const nameArray = value.split(' ');
            acc.first_name = nameArray[0];
            acc.last_name = nameArray[1];
          } else if (key === 'userName') {
            acc.username = value;
          } else {
            acc[key] = value;
          }
        }
        return acc;
      },
      {},
    );

    if (coverImage) {
      updatedFieldsObj.banner = coverImage;
    }
    if (profileImage) {
      updatedFieldsObj.profileImage = profileImage;
    }

    const formData: any = new FormData();
    Object.entries(updatedFieldsObj).forEach(([key, value]: any) => {
      if (key) {
        formData.append(key, value);
      }
    });
    if (Object.keys(updatedFieldsObj).length) {
      dispatch(updateProfileAction(formData))
        .unwrap()
        .then(() => {
          setCoverImage(null);
          setProfileImage(null);
          setSuccessModal((prev) => !prev);
        })
        .catch((rejectedValue: any) => {
          if (
            rejectedValue.customErrorNumber === -2 &&
            rejectedValue?.message ===
              'You can change username only after 15 days '
          ) {
            formik.setFieldError(
              'userName',
              'Username can only be changed once in 15 days',
            );
          } else {
            setGlobalError(rejectedValue?.message);
          }
          if (rejectedValue.customErrorNumber === 101205) {
            formik.setFieldError('fullName', rejectedValue.message);
          }
          setCoverImage(null);
          setProfileImage(null);
        });
    }
  };

  const handleUsernameUpdate = () => {
    if (userDetails.lastUserNameChange) {
      const lastDate = new Date(userDetails.lastUserNameChange);
      const currentDate = Date.now();
      const timeDifference = currentDate - lastDate.getTime();
      const millisecondsInADay = 24 * 60 * 60 * 1000;
      const daysDifference = Math.floor(timeDifference / millisecondsInADay);
      const updateAfter = 15 - daysDifference;
      updateAfter <= 15
        ? formik.setFieldError(
            'userName',
            `You can update your username after ${
              updateAfter >= 0 ? updateAfter : 0
            } ${updateAfter === 1 ? 'day' : 'days'}.`,
          )
        : setCanUpdateUsername(true);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: profileValidationSchema,
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

  const navigationHandler = () => {
    setIsSuccess(false);
    router.push('/login');
    return;
  };

  const handleSuccessModel = () => {
    togglePasswordModal(false);
    setIsSuccess(true);
  };

  return (
    <div className="profile-form">
      <form className="form" onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <div
            className="form-element"
            onFocus={() => formik.setFieldError('fullName', '')}
          >
            <TextField
              value={formik.values.fullName}
              name="fullName"
              placeholder="Enter "
              label="Display Name"
              disabled={
                userDetails?.isKycVerified ||
                userDetails?.kycStatus === 'initiated'
              }
              onChange={formik.handleChange}
            />
            {formik.errors.fullName && formik.touched.fullName && (
              <p className="error">{formik.errors.fullName}</p>
            )}
          </div>
          <div
            className="form-element"
            onFocus={() => handleUsernameUpdate()}
            onBlur={() => formik.setFieldError('userName', '')}
          >
            <TextField
              value={formik.values.userName}
              name="userName"
              placeholder="Enter "
              label="Username*"
              onChange={
                canUpdateUsername ? formik.handleChange : handleUsernameUpdate
              }
            />
            {formik.errors.userName && (
              <p className="error">{formik.errors.userName}</p>
            )}
          </div>
        </div>
        <div className="form-group">
          <div className="form-element">
            <TextField
              value={formik.values.email}
              disabled
              name="email"
              placeholder="Enter email"
              label="Email Address*"
              onChange={formik.handleChange}
              prefix={
                userDetails?.isKycVerified ? (
                  <Image src={StarIcon} alt="" className="email-verifier" />
                ) : (
                  ''
                )
              }
            />
            {formik.errors.email && formik.touched.email && (
              <p className="error">{formik.errors.email}</p>
            )}
          </div>
          <div className="form-element">
            <TextField
              value={formik.values.phone}
              name="phone"
              placeholder={`${selectedDropdownValue.value} Enter phone no.`}
              label="Phone Number"
              className="phone-number-input"
              onChange={formik.handleChange}
              prefix={
                <div className="form-input-dropdown">
                  <Dropdown show={open} onToggle={() => setOpen(!open)}>
                    <Dropdown.Toggle className="dropdown-btn">
                      <span>{selectedDropdownValue.label}</span>
                      <Arrow
                        className={`arrow-down ${open ? 'arrow-up' : ''}`}
                        width={11}
                        height={9}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {menuItems.map((item, index) => (
                        <Dropdown.Item
                          eventKey={item.label}
                          key={index}
                          onClick={() => setSelectedDropdownValue(item)}
                        >
                          <span className="value">
                            {item.label} {item.value}
                          </span>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              }
            />
            {formik.errors.phone && formik.touched.phone && (
              <p className="error">{formik.errors.phone}</p>
            )}
          </div>
        </div>
        <div className="d-flex flex-column w-100 form-element">
          <GenericTextArea
            value={formik.values.bio}
            name="bio"
            placeholder="Enter bio"
            label="Bio"
            onChange={formik.handleChange}
          />
          {formik.errors.bio && formik.touched.bio && (
            <p className="error">{formik.errors.bio}</p>
          )}
        </div>
        <div className="form-group">
          <div className="form-element">
            <TextField
              value={formik.values.twitter}
              name="twitter"
              placeholder="Enter your Twitter URL here"
              label="Twitter"
              onChange={formik.handleChange}
            />
          </div>
          <div className="form-element">
            <TextField
              value={formik.values.instagram}
              name="instagram"
              placeholder="Enter your Instagram URL here"
              label="Instagram"
              onChange={formik.handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="form-element">
            <TextField
              value={formik.values.discord}
              name="discord"
              placeholder="Enter your Discord URL here"
              label="Discord"
              onChange={formik.handleChange}
            />
          </div>
          <div className="form-element">
            <TextField
              value={formik.values.website}
              name="website"
              placeholder="www.jayesh.com"
              label="Website"
              onChange={formik.handleChange}
            />
          </div>
        </div>
        {globalError && <div className="global-error">{globalError}</div>}
        <div className="form-group d-flex w-100 justify-content-between align-items-center">
          <Button
            isGradient
            text="Change password"
            className="outlined changebutton p-0"
            onClick={() => togglePasswordModal(!showPasswordModal)}
          />
          <GenericModal
            show={showPasswordModal}
            onHide={() => togglePasswordModal(!showPasswordModal)}
            title="Change password"
            body={<ChangePassword handleSuccessModel={handleSuccessModel} />}
            className=""
            close={true}
            backdrop="static"
          />
          <button className="filled radius-btn" type="submit">
            Save Changes
          </button>
        </div>
      </form>
      {
        <CustomModal
          show={successModal}
          onHide={() => setSuccessModal((prev) => !prev)}
        >
          <div className="profile-update-success-modal">
            <div className="proifle-image">
              <Image
                src={SuccessToaster}
                width={1000}
                height={1000}
                alt="tick-mark-gif"
                quality={100}
              />
            </div>
            <span className="heading-password-text">
              Profile updated successfully!
            </span>
            <Button
              text="OK"
              onClick={() => setSuccessModal((prev) => !prev)}
              className="change-password-btn filled"
            />
          </div>
        </CustomModal>
      }
      {isSuccess && (
        <CustomModal show={isSuccess} onHide={() => setIsSuccess(false)}>
          <div className="change-password-modal">
            <div className="change-password-image">
              <Image src={SuccessToaster} alt="tick-mark-gif" quality={100} />
            </div>
            <span className="heading-password">
              Password Changed Successfully!
            </span>

            <Button
              text="OK"
              onClick={() => navigationHandler()}
              className="change-password-btn filled"
            />
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default ProfileForm;
