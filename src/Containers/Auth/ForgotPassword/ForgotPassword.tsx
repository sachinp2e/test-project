'use client';
import React, { useEffect, useState } from 'react';
import AuthHoc from '@/Containers/Auth/AuthHoc';
import { useAppDispatch } from '@/Lib/hooks';
import { forgotPasswordAction } from '@/Lib/auth/auth.action';
import { useAppSelector } from '../../../Lib/hooks';
import { authSelector } from '../../../Lib/auth/auth.selector';
import { Spinner, Toast } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { LoginLogo } from '../../../Assets/svg';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './forgot-password.scss';

interface IForgotPasswordType {
}

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const forgotSchema = Yup.object({
  email: Yup.string()
  .required('')
  .matches(emailRegex, 'Email is incorrect, please enter valid email ID'),
});

const ForgotPassword: React.FC<IForgotPasswordType> = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {loading} = useAppSelector(authSelector);

  const [alertMsg, setAlertMsg] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [btnVis, setBtnVis] = useState<boolean>(true);
  const [seconds, setSeconds] = useState<number>(0);
  const [ globalError, setGlobalError ] = useState('');
  const [ alertErrorMsg, setAlerErrortMsg ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState('')

  const { values, errors, handleChange, handleSubmit, touched, handleBlur } = useFormik({
    initialValues: {
      email: '',
    },

    validationSchema: forgotSchema,
    onSubmit: async (values, {setSubmitting}) => {
      const {email} = values;
      const data: any = await dispatch(forgotPasswordAction(email));
      if (data.payload.httpStatus === 400 && data.payload.customErrorNumber === 101201) {
        setAlerErrortMsg(true);
        setErrorMessage('Please enter valid email address.')
        setGlobalError('We could not find any account associated with given email. Please enter valid email address.' );
      } else if (data.payload.status === 200) {
        setSeconds(60);
        setBtnVis(false);
        setAlertMsg(true);
        setMessage(data.payload?.result?.message);
      }
      setSubmitting(false);
    },
  });

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    let interval: any;
    if (!btnVis) {
      interval = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 1) {
            setBtnVis(true);
            clearInterval(interval);
          }
          return prevSec - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [btnVis]);

  return (
    <AuthHoc>
      <>
        {alertMsg && (
          <Toast
            className="toast"
            onClose={() => setAlertMsg(false)}
            show={alertMsg}
            delay={3000}
            autohide
          >
            {message && <Toast.Body className="bg-message">{message}</Toast.Body>}
          </Toast>
        )}
        {alertErrorMsg && (
          <Toast
            className="toast"
            onClose={() => setAlerErrortMsg(false)}
            show={alertErrorMsg}
            autohide
          >
            {alertErrorMsg && <Toast.Body className="bg-error-message">{errorMessage}</Toast.Body>}
          </Toast>
        )}
        <div className="forget-password">
          <div className="logo">
            <LoginLogo />
          </div>
          <div className="heading-container">
            <div className="heading">Reset your password</div>
            <div className="sub-heading"><span>Note: </span>Changing your credentials will change it across both NFTm and MyIPR.</div>
            {alertErrorMsg ? (
              <div className="global-error-msg">{globalError}</div>
            ) : null}
          </div>
          <div>
            <form className="forget-form" onSubmit={handleSubmit}>
              <div className="forget-form-field">
                <label className="forget-label">Email ID </label>
                <input
                  type="text"
                  className={`${touched.email && errors.email ? 'error-input' : 'forget-input'}`}
                  onBlur={handleBlur}
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                  name="email"
                />
                {errors.email && touched.email ? (
                  <p className="form-error">{errors.email}</p>
                ) : null}
              </div>
              <div className="forget-btn-wrapper">
                <button type="submit" className={`forget-btn ${!btnVis? 'disable':''}`} disabled={!btnVis || loading}>
                  {btnVis ? 'Send Link' : 'Wait'}
                  {loading && <Spinner size='sm'/>}
                  {!btnVis && <span>{!btnVis && ` for : ${formatTime(seconds)} sec`}</span>}
                </button>
                <div className="back">
                  <span onClick={() => router.push('/login')}>Back to login</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    </AuthHoc>
  );
};

export default ForgotPassword;
