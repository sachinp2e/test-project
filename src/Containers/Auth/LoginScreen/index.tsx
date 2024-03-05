'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CloseEyeIconSVG, Info, LoginLogo, OpenEyeIconSVG } from '@/Assets/svg';
import { loginAction } from '@/Lib/auth/auth.action';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import AuthHoc from '@/Containers/Auth/AuthHoc';
import { logout } from '@/Lib/auth/auth.slice';
import Button from '@/Components/Button';
import VerifyEmailModal from '@/Containers/Auth/LoginScreen/verifyEmailModal';
import './login-screen.scss';
import Link from 'next/link';
import { clearWalletBalance } from '@/Lib/wallet/wallet.slice';

interface ILoginScreenType {}

type ILoginType = {
  email: string;
  password: string;
};
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const loginSchema = Yup.object().shape({
  email: Yup.string().required('Email/Username is required.'),
  password: Yup.string()
    .required('Password is required.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])(?=.{8,})/,
      'Incorrect Password',
    ),
});

const LoginScreen: React.FC<ILoginScreenType> = () => {
  const isLoggedIn = useAppSelector(authSelector);
  const { loading } = isLoggedIn;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [type, setType] = useState<string>('password');
  const [globalError, setGlobalError] = useState<string>();
  const [showVerificationError, toggleVerificationError] =
    useState<boolean>(false);
  const [verificationModal, toggleVerificationModal] = useState<boolean>(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    setErrors,
  } = useFormik<ILoginType>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values: ILoginType) => {
      const payloadValue = {
        email: values.email,
        password: values.password,
      };

      const data: any = await dispatch(loginAction(payloadValue));
      dispatch(clearWalletBalance());
      if (
        data.payload.status === 400 &&
        data.payload.customErrorNumber === 1001 &&
        data.payload.message === 'Please verify your email.'
      ) {
        toggleVerificationError(true);
      } else if (
        data.payload.status === 400 &&
        data.payload.customErrorNumber === 9008
      ) {
        setErrors({ email: ' ', password: data.payload.message });
      } else if (
        data.payload.status === 400 &&
        data.payload.customErrorNumber === 1000
      ) {
        setErrors({ email: data.payload.message });
      } else if (data.payload.status === 200) {
        router.push('/');
      } else {
        setGlobalError(data.payload.message);
      }
    },
  });

  const handleEyeClick = () => {
    setType(type === 'password' ? 'text' : 'password');
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      dispatch(logout());
    }
  }, []);

  return (
    <>
      <AuthHoc>
        <div className="login-main-form">
          <Link href="/" className="login-logo" style={{ cursor: 'pointer' }}>
            <LoginLogo />
          </Link>
          <div className="login-wrapper">
            <div className="login-heading">
              <span>Login</span>
            </div>
            {showVerificationError && (
              <div className="verify-email-section">
                <div className="text">
                  <Info fill="red" height={20} width={20} />
                  <p>Please verify your email.</p>
                </div>
                <Button
                  isFilled
                  isGradient
                  onClick={() => toggleVerificationModal(true)}
                  text="Resend Email"
                />
              </div>
            )}
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-form-field">
                <label className="login-label">Email/Username</label>
                <div>
                  <input
                    type="text"
                    className={`${
                      touched.email && errors.email
                        ? 'error-input'
                        : 'login-input'
                    }`}
                    onBlur={handleBlur}
                    placeholder="Enter email or username"
                    value={values.email}
                    onChange={handleChange}
                    name="email"
                  />
                  {errors.email?.trim() && touched.email ? (
                    <p className="form-error">{errors?.email}</p>
                  ) : null}
                </div>
              </div>
              <div className="login-form-field">
                <label className="login-label">Password</label>
                <div className="password-block">
                  <input
                    type={`${type}`}
                    className={`${
                      touched.password && errors.password
                        ? 'error-input'
                        : 'login-input'
                    }`}
                    onBlur={handleBlur}
                    name="password"
                    placeholder="Enter Password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  <div className="eye-icon" onClick={handleEyeClick}>
                    {type === 'password' ? (
                      <CloseEyeIconSVG />
                    ) : (
                      <OpenEyeIconSVG />
                    )}
                  </div>
                  {errors.password && touched.password ? (
                    <p className="form-error">{errors.password}</p>
                  ) : null}
                </div>
              </div>
              <div className="forgot-password">
                <span
                  className="forgot-password-link"
                  onClick={() => router.push('/forgot-password')}
                >
                  Forgot password?
                </span>
              </div>
              {globalError && (
                <div className="global-error">
                  <span>{globalError}</span>
                </div>
              )}
              <button type="submit" className="login-btn filled">
                {loading && <span className="loader" />}
                Login
              </button>
            </form>
            <div className="login-signup-text">
              Don't have an account?{' '}
              <span
                className="signup-link"
                onClick={() => router.push('/signup')}
              >
                Create an account
              </span>
            </div>
          </div>
        </div>
      </AuthHoc>
      {verificationModal && (
        <VerifyEmailModal onHide={() => toggleVerificationModal(false)} />
      )}
    </>
  );
};

export default LoginScreen;
