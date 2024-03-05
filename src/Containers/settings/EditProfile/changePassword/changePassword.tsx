'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { changePasswordAction } from '@/Lib/auth/auth.action';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import {
  CloseEyeIconSVG,
  HintIcon,
  OpenEyeIconSVG, OverlayBack,
} from '@/Assets/svg';
import './changePassword.scss';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from '@/Components/Button';

interface IPasswordFieldType {
  oldPassword: 'password' | 'text';
  newPassword: 'password' | 'text';
  confirm_password: 'password' | 'text';
}

type IPasswordFields = 'oldPassword' | 'newPassword' | 'confirm_password';

interface ChangePasswordType {
  handleSuccessModel: () => void;
}

const passwordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Please enter your current password'),
  newPassword: Yup.string()
    .required('Please enter a new password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])(?=.{8,})/,
      'Password must be atleast 8 characters...'
    ),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
    .required('Please confirm your new password'),
});

const ChangePassword: React.FC<ChangePasswordType> = ({ handleSuccessModel }) => {
  const { loading } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  const [globalError, setGlobalError] = useState<string>('')

  const [passwordFieldType, setPasswordFieldType] =
    useState<IPasswordFieldType>({
      oldPassword: 'password',
      newPassword: 'password',
      confirm_password: 'password',
    });

  const { values, errors, touched, handleChange, handleSubmit, handleBlur, setErrors } =
    useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirm_password: '',
    },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      try {
        setGlobalError('')
        const { oldPassword, newPassword } = values;
        const data: any = await dispatch(changePasswordAction({ oldPassword, newPassword }));

        if (data.payload?.httpStatus === 400 && data.payload?.customErrorNumber === -2) {
          setErrors({ oldPassword: 'Invalid password!' });
        } else if (data.payload?.status === 400 && data.payload?.customErrorNumber === 1003) {
          setGlobalError('Password cannot be one of your previous five passwords. Please choose a different one.');
        } else if (data.payload?.status === 400 && data.payload?.customErrorNumber === 9011){
          setGlobalError('Password cannot be one of your previous five passwords. Please choose a different one.');
          setGlobalError(data.payload?.message || 'Incorrect current password.')
        } else if (data.payload?.status === 400 && data.payload?.customErrorNumber === 9012){
          setGlobalError('Password cannot be one of your previous five passwords. Please choose a different one.');
        } else if (data.payload?.status === 200) {
          handleSuccessModel();
        }
      } catch (error:any) {
        if (error.payload && error.payload.oldPassword && error.payload.newPassword) {
          setErrors({
            oldPassword: error.payload.oldPassword,
            newPassword: error.payload.newPassword,
          });
        }
      }
    },
  });

  const handleEyeClick = (type: IPasswordFields) => {
    setPasswordFieldType({
      ...passwordFieldType,
      [type]: passwordFieldType[type] === 'password' ? 'text' : 'password',
    });
  };

  return (
    <>
      <div className="m-0 change-password-container">
        {globalError && <div className="global-error">{globalError}</div>}
        <div className="change-password-layout">
          <form className="change-password-form" onSubmit={handleSubmit}>
            <div className="change-password-form-field">
              <label className="change-password-label">Current Password*</label>
              <input
                type={`${passwordFieldType.oldPassword}`}
                className={`${touched.oldPassword && errors.oldPassword ? 'error-input' : 'change-password-input'}`}
                onBlur={handleBlur}
                placeholder="Enter Current Password"
                name="oldPassword"
                value={values.oldPassword}
                onChange={handleChange}
              />
              {errors.oldPassword && touched.oldPassword ? (
                <p className="form-error">{errors.oldPassword}</p>
              ) : null}
              <div className="eye-icon1" onClick={() => handleEyeClick('oldPassword')}>
                {passwordFieldType.oldPassword === 'password' ? (
                  <CloseEyeIconSVG />
                ) : (
                  <OpenEyeIconSVG />
                )}
              </div>
            </div>
            <div className="change-password-form-field">
              <label className="change-password-label">New Password*</label>
              <input
                type={`${passwordFieldType.newPassword}`}
                className={`${touched.newPassword && errors.newPassword ? 'error-input error-input-password' : 'change-password-input'}`}
                onBlur={handleBlur}
                placeholder="Enter New Password"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
              />
              <div className="eye-icon2" onClick={() => handleEyeClick('newPassword')}>
                {passwordFieldType.newPassword === 'password' ? (
                  <CloseEyeIconSVG />
                ) : (
                  <OpenEyeIconSVG />
                )}
              </div>
              <OverlayTrigger
                key="password-info"
                placement="left-start"
                overlay={
                  <div className="password-overlay">
                    <span className="password-following">Password must include the following:</span>
                    <ul>
                      <li>
                        <span>Minimum of 8 and a maximum of 20 characters- the more, the better.</span>
                      </li>
                      <li>
                        <span>Atleast one number, upper-case & lowercase alphabet</span>
                      </li>
                      <li>
                        <span>Atleast one special character which includes “ ! @ # $ % & * ( ) - + = ^ ” </span>
                      </li>
                    </ul>
                    <OverlayBack />
                  </div>
                }
              >
                <p className={`${errors.newPassword && touched.newPassword ? 'form-error' : ''}`}>
                    <span className="hint">
                      <HintIcon />{' '}
                      {errors.newPassword || 'Password must be atleast 8 characters...'}
                    </span>
                </p>
              </OverlayTrigger>
            </div>
            <div className="change-password-form-field">
              <label className="change-password-label">Confirm Password*</label>
              <input
                type={`${passwordFieldType.confirm_password}`}
                className={`${touched.confirm_password && errors.confirm_password ? 'error-input-password' : 'change-password-input'}`}
                onBlur={handleBlur}
                placeholder="Confirm New Password"
                name="confirm_password"
                value={values.confirm_password}
                onChange={handleChange}
              />
              {errors.confirm_password && touched.confirm_password ? (
                <p className="form-error">{errors.confirm_password}</p>
              ) : null}
              <div className="eye-icon3" onClick={() => handleEyeClick('confirm_password')}>
                {passwordFieldType.confirm_password === 'password' ? (
                  <CloseEyeIconSVG />
                ) : (
                  <OpenEyeIconSVG />
                )}
              </div>
            </div>
            <div className="change-password-btn-wrapper">
              <Button
                isGradient
                isFilled
                text="Change Password"
                isLoading={loading}
                disabled={Object.keys(errors).length > 0}
              />
            </div>
          </form>
        </div>
      </div>

    </>
  );
};

export default ChangePassword;
