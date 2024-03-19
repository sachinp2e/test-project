'use client';
import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/Components/Button';
import contactUsImg from '@/Assets/_images/contact-us-img.png';
import './contact-us.scss';
import axiosInstance from '@/Lib/axios';
import { toastErrorMessage, toastSuccessMessage } from '@/utils/constants';

const initialValues = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required'),
  email: Yup.string()
    .required('Email is required')
    .matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9]{2,})+$/, 'Invalid email format'),
  phone: Yup.string()
    .required('Contact number is required')
    .matches(/^\d{10}$/, 'Contact number must be 10 digits'),
  message: Yup.string().required('Message is required'),
});


const ContactUs = () => {

  const { values, errors, touched, handleChange, handleSubmit, handleBlur, setErrors, } =
    useFormik({
      initialValues, validationSchema, onSubmit: (values) => {
        submitContactUs(values);
      },
    });
  
    const submitContactUs = async (payload: any) => {
      try {
        const response = await axiosInstance.post('/contact-us', payload);
        if (response.status === 200) { 
          toastSuccessMessage('Submitted successfully!')
        } else {
          toastErrorMessage(response?.data?.message || 'Something went wrong!')
        }
      } catch (err: any) {
        toastErrorMessage(err?.response?.data?.message || 'Something went wrong!')
      }
    };

  return (
    <>
      <div className="contact-us-container d-flex justify-content-center">
        <div className='d-flex flex-column justify-content-center my-5'>
          <h1>CONTACT US</h1>
          <span>
            We believe in a journey towards a transparent marketplace <br />
            connecting creators and collectors globally.
          </span>
        </div>
      </div>
      <div className='contact-us-body d-flex justify-content-center align-items-center mx-5 my-5'>
        <div className='contact-us-body-left d-flex flex-column gap-5'>
          <Image src={contactUsImg} alt='contact-img' quality={100} height={500} width={500} />
          <div>
            <h3>Connect with us</h3>
            <span>
              Have a query or need assistance? Fill in your details,<br className='display-none' />
              and our team will reach out to assist you on your <br className='display-none' />
              ASSET journey.
            </span>
          </div>
          <span className='contact-us-mail-text'>
            For any further enquiry, please feel free to contact us <br className='display-none' />
            on <Link href="mailto:support@niftiq.io">support@niftiq.io</Link>
          </span>
        </div>
        <div className='contact-us-body-right'>
          <form onSubmit={handleSubmit}>
            <div className='form-input-field-wrapper d-flex flex-column gap-4'>
              <div>
                <label htmlFor="full-name">Full Name</label>
                <input type="text" id='full-name' name='name' placeholder='Enter name'
                   value={values.name} onChange={handleChange} onBlur={handleBlur}/>
                {touched.name && errors.name ? (
                <span className="error-message">{errors.name}</span>) : null}
              </div>
              <div>
                <label htmlFor="email">Email ID</label>
                <input type="text" id='email' name='email' placeholder='Enter email'
                   value={values.email} onChange={handleChange} onBlur={handleBlur}/>
                {touched.email && errors.email ? (
                <span className="error-message">{errors.email}</span>) : null}
              </div>
              <div>
                <label htmlFor="contact-number">Contact Number</label>
                <input type="text" id='contact-number' name='phone' placeholder='Enter number'
                   value={values.phone} onChange={handleChange} onBlur={handleBlur} />
                {touched.phone && errors.phone ? (
                <span className="error-message">{errors.phone}</span>) : null}
              </div>
              <div>
                <label htmlFor="message">Message</label>
                <textarea id="message" name='message' rows={4} cols={30} placeholder='Enter message'
                  value={values.message} onChange={handleChange} onBlur={handleBlur} />
                {touched.message && errors.message ? (
                <span className="error-message">{errors.message}</span>) : null}
              </div>
            </div>
            <Button className="contact-us-btn mt-4" type="submit" isFilled isGradient 
              element={
                <div className="d-flex align-items-center">
                  <span className="me-2">Submit</span>
                </div>
              }/>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
