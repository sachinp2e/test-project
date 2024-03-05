import axiosInstance from '../axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface IUpdateProfile {
  firstName?: string;
  lastName?: string;
  userName?: string;
  bio?: string;
  profileImage?: File;
  phone?: string;
  bannerImage?: string;
  website?: null;
  instagram?: string;
  twitter?: null;
  discord?: string;
}

export const registerAction = createAsyncThunk(
  'user/register',
  async (data: any, thunkAPI: any) => {
    try {
      const response = await axiosInstance.post('/user/register', data);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const loginAction = createAsyncThunk(
  'user/login',
  async (data: any, thunkAPI: any) => {
    try {
      const response = await axiosInstance.post('/user/login', data);
      if (typeof window !== 'undefined' && response?.data?.status === 200) {
        localStorage.setItem(
          'accessToken',
          response?.data?.result?.access_token,
        );
        localStorage.setItem(
          'refreshToken',
          response?.data?.result?.refresh_token,
        );
        localStorage.setItem('userId', response?.data?.result?.userId);
        localStorage.setItem('id', response?.data?.result?.id);
      }
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const getProfileAction = createAsyncThunk('user/profile', async () => {
  try {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
  } catch (error: any) {
    console.log(error);
    // return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const otpAction = createAsyncThunk<any>(
  'user/verify-email-otp',
  async (payload: any, thunkAPI: any) => {
    try {
      const response = await axiosInstance.post(
        '/user/verify-email-otp',
        payload,
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const resendAction = createAsyncThunk<any>(
  'user/resend-email-otp',
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        '/user/resend-email-otp',
        payload,
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const forgotPasswordAction = createAsyncThunk(
  'user/forgot-password',
  async (email: string, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/user/forgot-password/${email}`,
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const resetPasswordAction = createAsyncThunk(
  'user/set-password',
  async (payload: any, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/user/set-password', payload);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const changePasswordAction = createAsyncThunk(
  'user/change-password',
  async (payload: any, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/user/password/change', payload);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const updateProfileAction = createAsyncThunk(
  'user/update-profile',
  async (data: FormData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/user/update-profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedFieldsObj: any = Object.fromEntries(
        Array.from(data.entries()).map(([key, value]:[string,any]) => {
          let updatedKey;
          switch (key) {
            case 'first_name':
              updatedKey = 'firstName';
              break;
            case 'last_name':
              updatedKey = 'lastName';
              break;
            case 'username':
              updatedKey = 'userName';
              break;
            case 'banner':
              updatedKey = 'bannerImage';
              value = URL.createObjectURL(value);
              break;
            case 'profileImage':
              updatedKey = key;
              value = URL.createObjectURL(value);
              break;
            default:
              updatedKey = key;
          }
          return [updatedKey, value];
        }),
      );
      return { updatedFieldsObj };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const getMyiprUserCredits = createAsyncThunk(
  'user/myipr-credits',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('user/get-myipr-credit');
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

