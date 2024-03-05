'use client';
import React, { useState } from 'react';
import Carousel from '@/Containers/Auth/Carousel/index';
import CustomModal from '../../../Components/CustomModal/index';
import { Col, Row } from 'react-bootstrap';
import { CloseEyeIconSVG, HintIcon, LoginLogo, OpenEyeIconSVG, OverlayBack } from '../../../Assets/svg';
import { useAppDispatch } from '@/Lib/hooks';
import { resetPasswordAction } from '@/Lib/auth/auth.action';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '../../../Lib/hooks';
import Button from '../../../Components/Button';
import { authSelector } from '../../../Lib/auth/auth.selector';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './reset-password.scss';

interface IPasswordType {

}

interface IPasswordFieldType {
  password: 'password' | 'text';
  confirm_password: 'password' | 'text';
}

type IPasswordFields = 'password' | 'confirm_password';

const passwordSchema = Yup.object().shape({
  password: Yup.string()
  .required('please enter a password')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])(?=.{8,})/,
    'This Password is too short. Use at least 8 characters, 1 uppercase, 1 lowercase, 1 special character, 1 number.'
  )
  .max(20, 'This Password is too long. Use at least 20 characters, 1 uppercase, 1 lowercase, 1 special character, 1 number.'),
  confirm_password: Yup.string()
  .oneOf([Yup.ref('password')], 'Password don\'t match')
});

const ResetPassword: React.FC<IPasswordType> = () => {

  const { loading } = useAppSelector(authSelector);
  const router = useRouter();
  const param = useParams();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [isHoveringPass, setIsHoveringPass] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<null | string>(null);
  const [passwordFieldType, setPasswordFieldType] =
    useState<IPasswordFieldType>({
      password: 'password',
      confirm_password: 'password',
    });

  const { values, errors, touched, handleChange, handleSubmit, handleBlur, setErrors } = useFormik({
    initialValues: {
      password: '',
      confirm_password: '',
    },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      const token = param.token;
      const { password } = values;
      const data: any = await dispatch(resetPasswordAction({ token, password }));
      if (data.payload.status === 400 && data.payload.customErrorNumber === 10018) {
        setGlobalError('Password cannot be one of your previous five passwords. Please choose a different one.');
      } else if (data.payload.status === 400 && data.payload.customErrorNumber === -2) {
        setErrors({ password: data.payload.message });
      } else if (data.payload.status === 200) {
        setOpen(true);
      }
    },
  });

  const handleEyeClick = (type: IPasswordFields) => {
    setPasswordFieldType({
      ...passwordFieldType,
      [type]: 'password' === passwordFieldType[type] ? 'text' : 'password',
    });
  };

  const handleMouseOverPass = () => {
    setIsHoveringPass(true);
  };

  const handleMouseOutPass = () => {
    setIsHoveringPass(false);
  };

  return (
    <>
      <Row className="m-0 reset-password-container">
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="carousel-screen p-0 align-self-center">
          <Carousel />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="reset-password p-0 align-self-center">
          <div className="logo">
            <LoginLogo />
          </div>
          <div className="reset-heading">
            <span>Reset your password</span>
          </div>
          <div>
            <form className="reset-form" onSubmit={handleSubmit}>
              <div className="reset-form-field">
                <label className="reset-label">New Password*</label>
                <div className="reset-password-block">
                  <input
                    type={`${passwordFieldType.password}`}
                    className={`${touched.password && errors.password ? 'error-input' : 'reset-input'}`}
                    onBlur={handleBlur}
                    placeholder="Enter Password"
                    name="password"
                    maxLength={21}
                    value={values.password}
                    onChange={handleChange}
                  />
                  {isHoveringPass && (
                    <div className="info-cont">
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
                  )}
                  {errors.password && touched.password ? (
                    <p className="form-error">
                      <span className="hint">
                        <span
                          onMouseOver={handleMouseOverPass}
                          onMouseOut={handleMouseOutPass}
                        >
                          <HintIcon />
                        </span>
                        {errors.password}
                      </span>
                    </p>
                  ) : (
                    <span className="hint">
                      <span
                        onMouseOver={handleMouseOverPass}
                        onMouseOut={handleMouseOutPass}
                      >
                        <HintIcon />
                      </span>
                        Hint: Password Must be at least 8 characters, 1 uppercase, 1 lowercase, 1 special character, 1 number.
                    </span>
                  )}
                </div>
                <div className="eye-icon" onClick={() => handleEyeClick('password')}>
                  {passwordFieldType.password === 'password' ? (
                    <CloseEyeIconSVG />
                  ) : (
                    <OpenEyeIconSVG />
                  )}
                </div>
              </div>
              <div className="reset-form-field">
                <label className="reset-label">Confirm Password*</label>
                <div className="reset-password-block">
                  <input
                    type={`${passwordFieldType.confirm_password}`}
                    className={`${touched.confirm_password && errors.confirm_password ? 'error-input' : 'reset-input'}`}
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
                {globalError && <div className="global-error mt-2">{globalError}</div>}
              </div>
              <div className="reset-btn-wrapper">
                <button type="submit" className="reset-btn filled">
                  {loading && <span className="loader" />}
                  Change Password
                </button>
                <div className="back">
                  <span onClick={() => router.push('/login')}>Back to login</span>
                </div>
              </div>
            </form>
          </div>
        </Col>
      </Row>
      {open &&
        <CustomModal
          show={open}
          onHide={() => setOpen(false)}
        >
          <div className="reset-password-modal">
            <div className="heading">Password Changed Successfully!</div>
            <div className="sub-heading">Your password has been changed across both MyIPR and NFT Marketplace.</div>
            <Button
              text="Login now"
              onClick={() => router.push('/login')}
              className="reset-password filled"
            />
          </div>
        </CustomModal>
      }
    </>
  );
};

export default ResetPassword;
