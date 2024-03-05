'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { CloseEyeIconSVG, GreenCheckedIcon, HintIcon, LoginLogo, OpenEyeIconSVG, OverlayBack } from '@/Assets/svg';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import { registerAction } from '@/Lib/auth/auth.action';
import AuthHoc from '@/Containers/Auth/AuthHoc';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '@/Lib/axios';
import './signup.scss';
import { useRouter } from 'next/navigation';

interface ISignupType {
}

interface IPasswordFieldType {
  password: 'password' | 'text';
  confirm_password: 'password' | 'text';
}

type IRegisterType = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  confirm_password: string;
}
type IPasswordFields = 'password' | 'confirm_password';

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const nameRegex = /^[a-zA-Z][\s.'-]*[a-zA-Z\s.'-]{0,}$/;
const usernameRegex = /^(?!.*\.\.)(?=.{4,16}$)[a-zA-Z][a-zA-Z0-9_.]*[a-zA-Z0-9_]$/;

const CreateSchema = Yup.object().shape({
  firstName: Yup.string()
  .matches(nameRegex, '1-25 characters with letters, \'.\', \'\'\', \'-\', and space. First character must be a letter.')
  .max(25, '1-25 characters with letters, \'.\', \'\'\', \'-\', and space. First character must be a letter.')
  .required('First Name is required'),
  lastName: Yup.string()
  .matches(nameRegex, '1-25 characters with letters, \'.\', \'\'\', \'-\', and space. First character must be a letter.')
  .max(25, '1-25 characters with letters, \'.\', \'\'\', \'-\', and space. First character must be a letter.')
  .required('Last Name is required'),
  email: Yup.string()
  .matches(emailRegex, 'Email is incorrect. Please enter valid email ID.')
  .required('Email is required'),
  userName: Yup.string()
  .matches(usernameRegex, 'Username must include the following...')
  .min(3, 'Username must include the following...')
  .max(16, 'Username must include the following...')
  .required('Username is required'),
  password: Yup.string()
  .min(8, 'Password must be atleast 8 characters...')
  .max(20, 'Password must be atleast 8 characters...')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])(?=.{8,})/,
    'Password must be atleast 8 characters...'
  ).required('Password is required'),
  confirm_password: Yup.string()
  .oneOf([Yup.ref('password')], 'Password don\'t match')
  .required('Confirm Password is required'),
});

const SignupScreen: React.FC<ISignupType> = () => {
  const router = useRouter();
  const isSignup = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  const [globalError, setGlobalError] = useState<string>();
  const [isHoveringUser, setIsHoveringUser] = useState<boolean>(false);
  const [usernameStatus, setUsernameStatus] = useState<null | 'FETCHING' | 'AVAILABLE' | 'USED'>(null);
  const [passwordFieldType, setPasswordFieldType] = useState<IPasswordFieldType>({
    password: 'password',
    confirm_password: 'password',
  });

  const {
    values,
    errors,
    setErrors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    isValid,
    validateField,
    setFieldValue,
  } = useFormik<IRegisterType>({
    initialValues: {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    validationSchema: CreateSchema,
    validateOnMount: false,
    onSubmit: async (values: any) => {
      const { confirm_password, ...payload } = values;
      if (confirm_password) {
        const data: any = await dispatch(registerAction(payload));
        if (data.payload.status === 400 && data.payload.customErrorNumber === 10006) {
          setErrors({ email: 'User with this email already exists!' });
        } else if (data.payload.status === 400 && data.payload.customErrorNumber === 1005) {
          setErrors({ userName: 'This username is not available. Please enter another username!' });
        } else if (data.payload.status === 200) {
          router.push(`/otp?email=${values.email}`);
        } else {
          setGlobalError(data.payload.message);
        }
      }
    },
  });

  const handleEyeClick = (type: IPasswordFields) => {
    setPasswordFieldType({
      ...passwordFieldType,
      [type]: 'password' === passwordFieldType[type] ? 'text' : 'password',
    });
  };

  const handleUser = () => {
    setIsHoveringUser(prev => !prev);
  };

  const verifyUsername = async (username: string) => {
    try {
      await validateField('userName');
      const response: any = await axiosInstance.get(`/user/username/${username}`);
      if (response.data?.result === 'available') {
        setUsernameStatus('AVAILABLE');
      } else {
        setUsernameStatus('USED');
        setErrors({ userName: 'Username already exists!' });
      }
    } catch (error: any) {
      console.log(error);
      setUsernameStatus('AVAILABLE');
    }
  };

  const debounced = useMemo(() => debounce(verifyUsername, 1000), []);

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = await setFieldValue('userName', e.target.value, true);
    if (!result?.userName && e.target.value) {
      setUsernameStatus('FETCHING');
      debounced(e.target.value);
    } else {
      setUsernameStatus(null);
    }
  };

  const isSubmitDisabled = !isValid || usernameStatus === 'FETCHING' || usernameStatus === 'USED';

  return (
    <AuthHoc>
      <div className="signup-main-container">
        <div className="signup-wrapper">
          <div className="signup-logo">
            <Link href="/">
              <LoginLogo />
            </Link>
          </div>
          <div className="heading">
            <div className="create-heading">Sign up</div>
            <span className="already-create">Already have an account?<Link href="/login">Login</Link></span>
          </div>
          <div className="form-main">
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="signup-form-field">
                <label className="signup-label">Name*</label>
                <div className="username-block w-100">
                  <div className="w-50">
                    <input
                      type="text"
                      className={`${(errors.firstName && touched.firstName) ? 'error-input' : 'signup-input'}`}
                      placeholder="First Name"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      maxLength={26}
                      onBlur={handleBlur}
                    />
                    {(errors.firstName && touched.firstName) ? (
                      <p className="form-error">{errors.firstName}</p>
                    ) : null}
                  </div>
                  <div className="w-50">
                    <input
                      type="text"
                      className={`${(errors.lastName && touched.lastName) ? 'error-input' : 'signup-input'}`}
                      placeholder="Last Name"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      maxLength={26}
                      onBlur={handleBlur}
                    />
                    {errors.lastName && touched.lastName ? (
                      <p className="form-error">{errors.lastName}</p>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="info-container">
                <div className="signup-form-field">
                  <label className="signup-label">Username*</label>
                  <div className="user-block">
                    <input
                      type="text"
                      className={`${((errors.userName && touched.userName) || usernameStatus === 'USED') ? 'error-input' : 'signup-input'}`}
                      onBlur={handleBlur}
                      placeholder="Enter username"
                      name="userName"
                      value={values.userName}
                      onChange={handleUsernameChange}
                      maxLength={17}
                    />
                    {(!errors.userName && values.userName && usernameStatus === 'AVAILABLE') && (
                      <span className="signup-icon">
                        <GreenCheckedIcon />
                      </span>
                    )}
                    {(usernameStatus === 'FETCHING') && (
                      <span className="signup-icon username-loader">
                        <Spinner size="sm" />
                      </span>
                    )}
                    {(errors.userName && touched.userName) ? (
                      <p className="form-error">
                        <span className="hint">
                          <span onMouseOver={handleUser} onMouseOut={handleUser}>
                            <HintIcon />
                          </span>
                          {errors.userName}
                        </span>
                      </p>
                    ) : usernameStatus === 'USED' ? (
                      <p className="form-error">This username is not available. Please enter another username!</p>
                    ) : (
                      <span className="hint">
                        <span onMouseOver={handleUser} onMouseOut={handleUser}>
                          <HintIcon />
                        </span>
                        Username must include the following...
                      </span>
                    )}
                  </div>
                </div>
                {isHoveringUser && (
                  <div className="info-cont">
                    <span className="password-following">Recommendations</span>
                    <ul>
                      <li>
                        <span>The username must be unique, between 4 and 16 characters & must have letters.</span>
                      </li>
                      <li>
                        <span>Username can have numbers or ' . ' or ' _ ' special character.</span>
                      </li>
                      <li>
                        <span>It's not allowed to have space, two or more consecutive dots in a row and to start or end the username with a dot.</span>
                      </li>
                    </ul>
                    <OverlayBack />
                  </div>
                )}
              </div>
              <div className="signup-form-field">
                <label className="signup-label">Email*</label>
                <input
                  type="text"
                  className={`${touched.email && errors.email ? 'error-input' : 'signup-input'}`}
                  onBlur={handleBlur}
                  placeholder="Enter email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
                {errors.email && touched.email ? (
                  <p className="form-error">{errors.email}</p>
                ) : null}
              </div>
              <div className="info-container">
                <div className="signup-form-field">
                  <label className="signup-label">Set Password*</label>
                  <div className="password-block">
                    <input
                      type={`${passwordFieldType.password}`}
                      className={`${touched.password && errors.password ? 'error-input' : 'signup-input'}`}
                      onBlur={handleBlur}
                      placeholder="Enter Password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="eye-icon" onClick={() => handleEyeClick('password')}>
                    {passwordFieldType.password === 'password' ? (
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
                    <p className={`${errors.password && touched.password ? 'form-error' : ''}`}>
                    <span className="hint">
                      <HintIcon />
                      {errors.password || 'Password must be atleast 8 characters...'}
                    </span>
                    </p>
                  </OverlayTrigger>
                </div>
              </div>
              <div className="signup-form-field">
                <label className="signup-label">Confirm Password*</label>
                <div className="password-block">
                <input
                    type={`${passwordFieldType.confirm_password}`}
                    className={`${touched.confirm_password && errors.confirm_password ? 'error-input' : 'signup-input'}`}
                    onBlur={handleBlur}
                    placeholder="Enter Password"
                    name="confirm_password"
                    value={values.confirm_password}
                    onChange={handleChange}
                  />
                  {errors.confirm_password && touched.confirm_password ? (
                    <p className="form-error">{errors.confirm_password}</p>
                  ) : null}
                </div>
                <div className="eye-icon" onClick={() => handleEyeClick('confirm_password')}>
                  {passwordFieldType.confirm_password === 'password' ? (
                    <CloseEyeIconSVG />
                  ) : (
                    <OpenEyeIconSVG />
                  )}
                </div>
              </div>
              {
                globalError && (
                  <div className="global-error">
                    {globalError}
                  </div>
                )
              }
              <button
                type="submit"
                className={`signup-btn ${isSubmitDisabled ? 'disabled-button' : 'signup-btn filled'}`}
                disabled={isSubmitDisabled}
              >
                {isSignup.loading && <span className="loader" />}
                Proceed
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthHoc>
  );
};

export default SignupScreen;
